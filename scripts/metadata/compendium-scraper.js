const fs = require('fs');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const path = require('path');

// Your navigation JSON from earlier
const navigation = [
    // {
    //   "title": "HISTORY & LORE",
    //   "url": "https://compendium.fringedrifters.com/history-lore",
    //   "slug": "history-lore"
    // },
    {
      "title": "Prominent Figures",
      "url": "https://compendium.fringedrifters.com/prominent-figures",
      "slug": "prominent-figures"
    },
    {
      "title": "Helmets & Masks",
      "url": "https://compendium.fringedrifters.com/helmets-masks",
      "slug": "helmets-masks"
    },
    {
      "title": "Mouth Machines",
      "url": "https://compendium.fringedrifters.com/mouth-machines",
      "slug": "mouth-machines"
    },
    {
      "title": "Tools & Weapons",
      "url": "https://compendium.fringedrifters.com/tools-weapons",
      "slug": "tools-weapons"
    },
    {
      "title": "Suits",
      "url": "https://compendium.fringedrifters.com/suits",
      "slug": "suits"
    },
    {
      "title": "Backpacks",
      "url": "https://compendium.fringedrifters.com/backpacks",
      "slug": "backpacks"
    },
    {
      "title": "Loot Cards",
      "url": "https://compendium.fringedrifters.com/specimens",
      "slug": "specimens"
    },
    {
      "title": "Iconography",
      "url": "https://compendium.fringedrifters.com/iconography",
      "slug": "iconography"
    },
    // {
    //   "title": "Bibliography",
    //   "url": "https://compendium.fringedrifters.com/bibliography",
    //   "slug": "bibliography"
    // },
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
    
    // Level 1: Get all detail page links from this category
    const detailLinks = await scrapeLinksFromPage(navItem.url);
    
    // Level 2: Visit each detail page and append its content
    for (const detailLink of detailLinks) {
      console.log(`  - Scraping ${detailLink.name}...`);
      
      try {
        const detailContent = await scrapeContentFromPage(detailLink.detailUrl);
        
        // Append this item's content to the markdown with a section header
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
      } catch (error) {
        console.error(`Error scraping ${detailLink.detailUrl}:`, error);
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

// Function to scrape content from a Level 2 detail page
async function scrapeContentFromPage(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract details
    const elementCode = document.querySelector('li:nth-child(1)').textContent.replace('Element Code:', '').trim();
    
    // These might not always be present, so check first
    let make = '';
    let model = '';
    let author = '';
    let authorLink = '';
    
    const makeElement = document.querySelector('li:nth-child(2)');
    if (makeElement && makeElement.textContent.includes('Make:')) {
      make = makeElement.textContent.replace('Make:', '').trim();
    }
    
    const modelElement = document.querySelector('li:nth-child(3)');
    if (modelElement && modelElement.textContent.includes('Model:')) {
      model = modelElement.textContent.replace('Model:', '').trim();
    }
    
    const authorElement = document.querySelector('li:nth-child(4)');
    if (authorElement) {
      const authorAnchor = authorElement.querySelector('a');
      if (authorAnchor) {
        author = authorAnchor.textContent.trim();
        authorLink = authorAnchor.getAttribute('href');
      }
    }
    
    // Extract the description 
    const descriptionDiv = document.querySelector('div.prose.dark\\:prose-light');
    const description = descriptionDiv ? descriptionDiv.textContent.trim() : '';
    
    return {
      elementCode,
      make,
      model,
      author,
      authorLink,
      description
    };
  } catch (error) {
    console.error(`Error scraping content from ${url}:`, error);
    throw error;
  }
}

// Run the scraper
scrapeCompendium()
  .then(() => console.log('Scraping completed successfully!'))
  .catch(error => console.error('Error during scraping:', error));