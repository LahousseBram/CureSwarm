const axios = require('axios');

// CrossRef API endpoint
const CROSSREF_API = 'https://api.crossref.org/works';

/**
 * Verify a DOI via CrossRef API
 * @param {string} doi - DOI to verify (with or without doi: prefix)
 * @returns {Promise<Object>} - Verification result with paper metadata
 */
async function verifyDOI(doi) {
  try {
    // Clean the DOI - remove doi: prefix if present
    const cleanDOI = doi.replace(/^doi:/, '');
    
    // Make request to CrossRef API
    const response = await axios.get(`${CROSSREF_API}/${encodeURIComponent(cleanDOI)}`, {
      headers: {
        'User-Agent': 'CureSwarm/1.0 (https://cureswarm.org; mailto:contact@cureswarm.org)'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.status === 200 && response.data.status === 'ok') {
      const work = response.data.message;
      
      return {
        verified: true,
        doi: cleanDOI,
        metadata: {
          title: work.title ? work.title[0] : null,
          authors: extractAuthors(work.author),
          journal: work['container-title'] ? work['container-title'][0] : null,
          year: extractYear(work),
          publisher: work.publisher || null,
          type: work.type || null,
          url: work.URL || `https://doi.org/${cleanDOI}`,
          abstract: work.abstract || null,
          issn: work.ISSN ? work.ISSN[0] : null,
          volume: work.volume || null,
          issue: work.issue || null,
          pages: work.page || null
        }
      };
    } else {
      return {
        verified: false,
        doi: cleanDOI,
        error: 'DOI not found in CrossRef database'
      };
    }
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // CrossRef API returned an error response
      if (error.response.status === 404) {
        return {
          verified: false,
          doi: doi.replace(/^doi:/, ''),
          error: 'DOI not found'
        };
      } else {
        return {
          verified: false,
          doi: doi.replace(/^doi:/, ''),
          error: `CrossRef API error: ${error.response.status}`
        };
      }
    } else if (error.code === 'ECONNABORTED') {
      return {
        verified: false,
        doi: doi.replace(/^doi:/, ''),
        error: 'Verification timeout - please try again'
      };
    } else {
      return {
        verified: false,
        doi: doi.replace(/^doi:/, ''),
        error: 'Network error during verification'
      };
    }
  }
}

/**
 * Extract authors from CrossRef author array
 * @param {Array} authorArray - CrossRef author array
 * @returns {string} - Formatted author string
 */
function extractAuthors(authorArray) {
  if (!authorArray || !Array.isArray(authorArray)) {
    return null;
  }

  return authorArray
    .slice(0, 10) // Limit to first 10 authors
    .map(author => {
      if (author.given && author.family) {
        return `${author.given} ${author.family}`;
      } else if (author.family) {
        return author.family;
      } else if (author.name) {
        return author.name;
      } else {
        return 'Unknown Author';
      }
    })
    .join(', ');
}

/**
 * Extract publication year from CrossRef date information
 * @param {Object} work - CrossRef work object
 * @returns {number|null} - Publication year
 */
function extractYear(work) {
  // Try different date fields in order of preference
  const dateSources = [
    work.published?.['date-parts']?.[0]?.[0],
    work['published-online']?.['date-parts']?.[0]?.[0],
    work['published-print']?.['date-parts']?.[0]?.[0],
    work.created?.['date-parts']?.[0]?.[0]
  ];

  for (const year of dateSources) {
    if (year && typeof year === 'number' && year > 1900 && year <= new Date().getFullYear() + 1) {
      return year;
    }
  }

  return null;
}

/**
 * Validate DOI format
 * @param {string} doi - DOI to validate
 * @returns {boolean} - Whether DOI format is valid
 */
function isValidDOIFormat(doi) {
  // DOI regex pattern - matches basic DOI format
  const doiPattern = /^(doi:)?10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/i;
  return doiPattern.test(doi);
}

/**
 * Batch verify multiple DOIs
 * @param {Array<string>} dois - Array of DOIs to verify
 * @returns {Promise<Array>} - Array of verification results
 */
async function verifyDOIBatch(dois) {
  // Limit batch size to prevent overwhelming the API
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < dois.length; i += batchSize) {
    const batch = dois.slice(i, i + batchSize);
    const batchPromises = batch.map(doi => verifyDOI(doi));
    
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            verified: false,
            doi: batch[index],
            error: 'Verification failed'
          });
        }
      });
      
      // Add delay between batches to be respectful to CrossRef API
      if (i + batchSize < dois.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      // Handle batch errors
      batch.forEach(doi => {
        results.push({
          verified: false,
          doi: doi,
          error: 'Batch verification failed'
        });
      });
    }
  }
  
  return results;
}

/**
 * Get DOI information for citation formatting
 * @param {string} doi - DOI to get info for
 * @returns {Promise<Object>} - Citation information
 */
async function getDOICitation(doi) {
  const verification = await verifyDOI(doi);
  
  if (verification.verified) {
    const meta = verification.metadata;
    return {
      title: meta.title,
      authors: meta.authors,
      journal: meta.journal,
      year: meta.year,
      doi: verification.doi,
      url: meta.url,
      citation: formatCitation(meta)
    };
  } else {
    return null;
  }
}

/**
 * Format citation in standard academic format
 * @param {Object} metadata - Paper metadata
 * @returns {string} - Formatted citation
 */
function formatCitation(metadata) {
  const parts = [];
  
  if (metadata.authors) {
    parts.push(metadata.authors);
  }
  
  if (metadata.year) {
    parts.push(`(${metadata.year})`);
  }
  
  if (metadata.title) {
    parts.push(`"${metadata.title}"`);
  }
  
  if (metadata.journal) {
    parts.push(metadata.journal);
  }
  
  if (metadata.volume) {
    parts.push(`Vol. ${metadata.volume}`);
  }
  
  if (metadata.issue) {
    parts.push(`Issue ${metadata.issue}`);
  }
  
  if (metadata.pages) {
    parts.push(`pp. ${metadata.pages}`);
  }
  
  return parts.join('. ') + '.';
}

module.exports = {
  verifyDOI,
  verifyDOIBatch,
  isValidDOIFormat,
  getDOICitation,
  formatCitation
};