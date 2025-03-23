const fs = require('fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const path = require('path');

// Your navigation JSON from earlier
const navigation = [
    // {
    //   "title": "HISTORY & LORE",
    //   "url": "https://compendium.fringedrifters.com/duzi-chant",
    //   "slug": "history-lore"
    // },
    // {
    //   "title": "Prominent Figures",
    //   "url": "https://compendium.fringedrifters.com/prominent-figures",
    //   "slug": "prominent-figures"
    // },
    // {
    //   "title": "Helmets & Masks",
    //   "url": "https://compendium.fringedrifters.com/helmets-masks",
    //   "slug": "helmets-masks"
    // },
    // {
    //   "title": "Mouth Machines",
    //   "url": "https://compendium.fringedrifters.com/mouth-machines",
    //   "slug": "mouth-machines"
    // },
    // {
    //   "title": "Tools & Weapons",
    //   "url": "https://compendium.fringedrifters.com/tools-weapons",
    //   "slug": "tools-weapons"
    // },
    // {
    //   "title": "Suits",
    //   "url": "https://compendium.fringedrifters.com/suits",
    //   "slug": "suits"
    // },
    // {
    //   "title": "Backpacks",
    //   "url": "https://compendium.fringedrifters.com/backpacks",
    //   "slug": "backpacks"
    // },
    // {
    //   "title": "Loot Cards",
    //   "url": "https://compendium.fringedrifters.com/specimens",
    //   "slug": "specimens"
    // },
    // {
    //   "title": "Iconography",
    //   "url": "https://compendium.fringedrifters.com/iconography",
    //   "slug": "iconography"
    // },
    {
      "title": "Bibliography",
      "url": "https://compendium.fringedrifters.com/bibliography",
      "slug": "bibliography"
    },
    // {
    //   "title": "Assets",
    //   "url": "https://compendium.fringedrifters.com/assets",
    //   "slug": "assets"
    // }
  ]

// Define the output directory (relative to project root)
const OUTPUT_DIR = path.join(process.cwd(), 'packages/fringe-core/docs/compendium/');

async function scrapeCompendium() {
  // Ensure the output directory exists
  ensureDirectoryExists(OUTPUT_DIR);
  
  // Process each navigation item
  for (const navItem of navigation) {
    console.log(`Processing ${navItem.title}...`);
    
    // Create markdown content with title
    let markdownContent = `# ${navItem.title}\n\n`;
    
    // Add section description if it exists
    if (navItem.description) {
      markdownContent += `${navItem.description}\n\n`;
    }
    
    // Determine page type based on slug
    const pageType = navItem.slug;
    
    // Use appropriate scraping function based on page type
    const detailLinks = await scrapeLinksFromSpecialPage(navItem.url, pageType);
    
    // Level 2: Visit each detail page and append its content
    for (const detailLink of detailLinks) {
      console.log(`  - Scraping ${detailLink.name}...`);
      
      try {
        const detailContent = await scrapeContentFromPage(detailLink.detailUrl, pageType);
        
        switch (pageType) {
          case 'history-lore':
            markdownContent += `## ${detailContent.title}\n\n`;
            if (detailContent.image) {
              markdownContent += `![${detailContent.title}](${detailContent.image})\n\n`;
            }
            markdownContent += `${detailContent.content}\n\n---\n\n`;
            break;
            
          case 'bibliography':
            markdownContent += `## ${detailContent.name}\n\n`;
            markdownContent += `${detailContent.description}\n\n`;
            if (detailContent.entries.length > 0) {
              markdownContent += `### Related Entries\n\n`;
              detailContent.entries.forEach(entry => {
                markdownContent += `- [${entry.title}](${entry.url})\n`;
              });
              markdownContent += `\n`;
            }
            markdownContent += `---\n\n`;
            break;
            
          default:
            // Use existing markdown formatting
            markdownContent += `## ${detailLink.name}\n\n`;
            markdownContent += `![${detailLink.name}](${detailLink.imageUrl})\n\n`;
            markdownContent += `**Element Code:** ${detailContent.elementCode}\n`;
            
            if (detailContent.make) {
              markdownContent += `**Make:** ${detailContent.make}\n`;
            }
            
            if (detailContent.model) {
              markdownContent += `**Model:** ${detailContent.model}\n`;
            }
            
            if (detailContent.author) {
              markdownContent += `**Author:** ${detailContent.author}\n`;
            }
            
            markdownContent += `\n${detailContent.description}\n\n---\n\n`;
        }
      } catch (error) {
        console.error(`Error processing ${detailLink.detailUrl}:`, error);
        markdownContent += `## ${detailLink.name}\n\n`;
        markdownContent += `*Error retrieving data*\n\n---\n\n`;
      }
    }
    
    // Write the markdown file for this navigation item in the specified directory
    const filePath = path.join(OUTPUT_DIR, `${navItem.slug}.md`);
    fs.writeFileSync(filePath, markdownContent);
    console.log(`Completed ${navItem.title}, saved to ${filePath}`);
  }
}

// Helper function to ensure the directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    // Create the directory recursively (create parent directories if needed)
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to scrape links from a Level 1 page
async function scrapeLinksFromPage(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    const items = [];
    // Select all the item containers
    const itemDivs = document.querySelectorAll('div.w-1\\/3.md\\:w-1\\/4.p-2');
    
    itemDivs.forEach(div => {
      const anchor = div.querySelector('a');
      const name = div.querySelector('span').textContent.trim();
      const imgElement = div.querySelector('img');
      const href = anchor.getAttribute('href');
      
      // Extract image URL and ensure it's absolute
      let imageUrl = imgElement.getAttribute('src');
      if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.origin}${imageUrl}`;
      }
      
      items.push({
        name,
        detailUrl: new URL(href, url).href,
        imageUrl
      });
    });
    
    return items;
  } catch (error) {
    console.error(`Error scraping links from ${url}:`, error);
    return [];
  }
}

// Modify scrapeContentFromPage to handle different page types
async function scrapeContentFromPage(url, pageType) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    switch (pageType) {
      case 'history-lore':
        const proseDiv = document.querySelector('div.prose');
        if (!proseDiv) {
          throw new Error('Could not find prose div');
        }
        
        const title = proseDiv.querySelector('h1')?.textContent?.trim() || 'Untitled';
        const image = proseDiv.querySelector('img')?.getAttribute('src') || null;
        
        // Get all paragraphs after the image for the story content
        const paragraphs = Array.from(proseDiv.querySelectorAll('p'))
          .filter(p => !p.querySelector('img')) // Exclude the image paragraph
          .map(p => p.textContent.trim())
          .join('\n\n');
        
        return {
          title,
          image,
          content: paragraphs,
          type: 'story'
        };

      case 'bibliography':
        const titleElement = document.querySelector('h1');
        if (!titleElement) {
          throw new Error('Could not find title element');
        }
        
        const name = titleElement.textContent.trim();
        const descriptionDiv = document.querySelector('div.prose');
        const description = descriptionDiv?.textContent?.trim() || '';
        
        // Get related entries if they exist
        const entries = [];
        const entriesSection = document.querySelector('h2.font-bold.uppercase');
        if (entriesSection) {
          const entryList = entriesSection.nextElementSibling;
          if (entryList && entryList.tagName === 'UL') {
            const links = entryList.querySelectorAll('li a');
            links.forEach(link => {
              entries.push({
                title: link.textContent.trim(),
                url: new URL(link.getAttribute('href'), url).href
              });
            });
          }
        }
        
        return {
          name,
          description,
          entries,
          type: 'reference'
        };

      default:
        // Use existing scraping logic for standard pages
        return scrapeStandardContentFromPage(url);
    }
  } catch (error) {
    console.error(`Error scraping content from ${url}:`, error);
    // Return a minimal object to prevent further errors
    return {
      title: 'Error',
      content: `Failed to scrape content: ${error.message}`,
      type: pageType
    };
  }
}

// Add new function to handle different page types
async function scrapeLinksFromSpecialPage(url, pageType) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    const items = [];
    
    switch (pageType) {
      case 'history-lore':
        const links = document.querySelectorAll('div.prose h2 a');
        links.forEach(link => {
          items.push({
            name: link.textContent.trim(),
            detailUrl: new URL(link.getAttribute('href'), url).href,
            imageUrl: null
          });
        });
        break;
        
      case 'bibliography':
        // Update selector to match the actual bibliography page structure
        const listItems = document.querySelectorAll('div.w-full.max-w-xl li');
        listItems.forEach(li => {
          const link = li.querySelector('a');
          if (link) {
            items.push({
              name: link.textContent.trim(),
              detailUrl: new URL(link.getAttribute('href'), url).href,
              imageUrl: null
            });
          }
        });
        break;
        
      default:
        return scrapeLinksFromPage(url);
    }
    
    return items;
  } catch (error) {
    console.error(`Error scraping links from ${url}:`, error);
    return [];
  }
}

// Run the scraper
scrapeCompendium()
  .then(() => console.log('Scraping completed successfully!'))
  .catch(error => console.error('Error during scraping:', error));