# Pro Bookmark Viewer – Chrome Extension
A modern, fast, and customizable **New Tab bookmark manager** built with HTML, CSS, and JavaScript.  
Designed to help users browse, search, organize, and manage bookmarks in a beautiful and efficient interface.

## 🚀 Features

### 🔖 Advanced Bookmark Management
- View all bookmarks in a clean grid interface  
- Add, edit, delete, and rearrange bookmarks  
- Drag-and-drop bookmark ordering  
- Folder-like grouping structure  
- Quick access to **Most Visited** and **Recently Added**

### 🔍 Powerful Search
- Search inside your bookmarks  
- Web search suggestions powered by **Google**  
- Smart filtering and inline results

### 🎨 Modern UI & UX
- Fully responsive layout  
- Light & Dark mode  
- Smooth transitions and animations  
- RTL support (Arabic, Hebrew, etc.)  
- Clean typography using *Inter* font

### ⚙️ Customizable Settings
- Choose grid size (Small / Medium / Large)  
- Enable/disable web suggestions  
- Toggle Most Visited section  
- Change animation settings  
- Multi-language support (English + Arabic)

### 📌 Extra Utilities
- Back-to-top button  
- Mini toast notifications  
- Settings modal and bookmark modal  
- LocalStorage caching  
- Chrome APIs (bookmarks, topSites, tabs)

## 📦 Installation (Developer Mode)

1. Download or clone the repository:
   ```bash
   git clone https://github.com/your-username/pro-bookmark-viewer.git
   ```
2. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
3. Enable **Developer mode** (top-right corner).
4. Click **Load unpacked**.
5. Select the project folder containing:
   - `manifest.json`
   - `pro-bookmark-viewer.html`
   - `pro-bookmark-viewer.css`
   - `pro-bookmark-viewer.js`

6. Open a new tab — the extension will replace your New Tab page.

## 🧩 Manifest (MV3)

The extension uses Chrome Manifest Version 3 with:

- `chrome_url_overrides.newtab`
- Permissions:
  - bookmarks  
  - topSites  
  - tabs  
  - storage  
- Host permissions:
  - `https://suggestqueries.google.com/*`

## 📁 Folder Structure

```
pro-bookmark-viewer/
│
├── manifest.json
├── pro-bookmark-viewer.html
├── pro-bookmark-viewer.css
├── pro-bookmark-viewer.js
│
└── /icons   (optional)
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🛠️ Technologies Used
- HTML5 / CSS3 / JavaScript
- Chrome Extensions (MV3)
- Chrome APIs (bookmarks, topSites, tabs, storage)
- Google Search Suggest API
- LocalStorage

## 🌐 Languages
- English
- Arabic (RTL Support)

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to contribute:

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Open a pull request  

## 📜 License

This project is licensed under the MIT License.  
You are free to use, modify, and distribute it.

## 👤 Author

**Zeyad MH**  
Frontend Developer & Software Engineer  
- Website: https://zeyadmh.com  
- Email: me@zeyadmh.com
