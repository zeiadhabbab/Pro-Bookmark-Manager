document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // These are the primary UI components used throughout the bookmark manager
    // They are cached here for performance and maintainability

    // Search form and input for performing bookmark/web searches
    const searchForm = document.getElementById('searchForm'); // The main search form container
    const searchInput = document.getElementById('searchInput'); // The text input field for queries
    const searchEngineLogo = document.getElementById('searchEngineLogo'); // Icon representing the selected search engine

    // Theme and user preferences
    const darkModeToggle = document.getElementById('darkModeToggle'); // Toggle button for dark/light mode

    // Main bookmark display areas
    const bookmarkGrid = document.getElementById('bookmarkGrid'); // Displays bookmarks in the current folder
    const mostVisitedGrid = document.getElementById('mostVisitedGrid'); // Shows user's most frequently visited bookmarks
    const recentlyAddedGrid = document.getElementById('recentlyAddedGrid'); // Shows bookmarks most recently added by the user

    // Search and navigation within bookmarks
    const bookmarkSearchBar = document.getElementById('bookmarkSearchBar'); // Filter/search bar specifically for bookmarks

    // Folder navigation components
    const primaryFolderTabs = document.getElementById('primaryFolderTabs'); // Tabs for primary (top-level) bookmark folders
    const subFolderTabs = document.getElementById('subFolderTabs'); // Tabs for subfolders within the currently selected folder
    const breadcrumbs = document.getElementById('breadcrumbs'); // Shows navigation path for nested folders

    // Main content area for dynamic display
    const contentArea = document.getElementById('contentArea'); // Dynamic container where main content is rendered

    // UX: Loading spinner and notifications
    const loadingSpinner = document.getElementById('loadingSpinner'); // Displays while bookmarks are loading or processing
    const toastContainer = document.getElementById('toastContainer'); // Container for feedback toasts/alerts

    // Utility: Back-to-top UX feature
    const backToTopBtn = document.getElementById('backToTopBtn'); // Button allowing user to quickly scroll to the top of the page
    
    // Quick access tabs
    const quickTabs = document.querySelectorAll('.quick-tab');
    
    // Control elements
    const sortBy = document.getElementById('sortBy');
    const filterBy = document.getElementById('filterBy');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const languageSelect = document.getElementById('languageSelect');
    
    // Modal elements
    const settingsModal = document.getElementById('settingsModal');
    const addBookmarkModal = document.getElementById('addBookmarkModal');
    const editBookmarkModal = document.getElementById('editBookmarkModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const addBookmarkBtn = document.getElementById('addBookmarkBtn');
    
    // Settings elements
    const gridSize = document.getElementById('gridSize');
    const defaultSearchEngine = document.getElementById('defaultSearchEngine');
    const showMostVisited = document.getElementById('showMostVisited');
    const showRecentlyAdded = document.getElementById('showRecentlyAdded');
    const animationsEnabled = document.getElementById('animationsEnabled');
    
    // Most Visited Sites List
    const mostVisitedList = document.getElementById('most-visited-list');

    // State variables
    let allBookmarks = [];
    let bookmarkTree = [];
    let currentFolder = null;
    let currentView = 'bookmarks';
    let settings = {
        gridSize: 'medium',
        defaultSearchEngine: 'google',
        showMostVisited: true,
        showRecentlyAdded: true,
        animationsEnabled: true,
        darkMode: false,
        language: 'en'
    };
    let draggedBookmarkEl = null;
    let currentLanguage = 'en';
    let currentBreadcrumbPath = [{ id: 'root' }];
    let mostVisitedItems = [];
    let recentlyAddedItems = [];
    let isDataLoaded = false;
    
    // Search engines configuration
    const searchEngines = {
        google: {
            name: 'Google',
            logo: '/icons/google-logo.svg',
            searchUrl: 'https://www.google.com/search?q='
        },
        bing: {
            name: 'Bing',
            logo: '/icons/bing.svg',
            searchUrl: 'https://www.bing.com/search?q='
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            logo: '/icons/duckduckgo.svg',
            searchUrl: 'https://duckduckgo.com/?q='
        },
        yahoo: {
            name: 'Yahoo',
            logo: '/icons/yahoo.svg',
            searchUrl: 'https://search.yahoo.com/search?p='
        }
    };

    // --- Localization ---
    const translations = {
        en: {
            'app.title': 'Pro Bookmark Manager',
            'modal.settings.title': 'Settings',
            'settings.gridSize': 'Grid Size:',
            'settings.gridSmall': 'Small',
            'settings.gridMedium': 'Medium',
            'settings.gridLarge': 'Large',
            'settings.defaultEngine': 'Default Search Engine:',
            'settings.engine.google': 'Google',
            'settings.engine.bing': 'Bing',
            'settings.engine.duckduckgo': 'DuckDuckGo',
            'settings.engine.yahoo': 'Yahoo',
            'settings.showMostVisited': 'Show Most Visited:',
            'settings.showRecentlyAdded': 'Show Recently Added:',
            'settings.animationsEnabled': 'Enable Animations:',
            'settings.save': 'Save Settings',
            'settings.reset': 'Reset to Default',
            'modal.addBookmark.title': 'Add Bookmark',
            'modal.fields.title': 'Title:',
            'modal.fields.url': 'URL:',
            'modal.fields.folder': 'Folder:',
            'modal.fields.selectFolder': 'Select folder...',
            'modal.fields.tags': 'Tags (comma-separated):',
            'modal.placeholders.title': 'Enter bookmark title',
            'modal.placeholders.url': 'https://example.com',
            'modal.placeholders.tags': 'work, important, reference',
            'modal.addBookmark.save': 'Save Bookmark',
            'modal.editBookmark.title': 'Edit Bookmark',
            'modal.editBookmark.update': 'Update Bookmark',
            'modal.editBookmark.delete': 'Delete Bookmark',
            'common.cancel': 'Cancel',
            'header.title': 'Pro Bookmark Manager',
            'header.addBookmarkTooltip': 'Add Bookmark',
            'header.settingsTooltip': 'Settings',
            'header.toggleDarkModeTooltip': 'Toggle Dark Mode',
            'language.selector': 'Language selector',
            'language.english': 'English',
            'language.arabic': 'العربية',
            'search.placeholder': 'Search or type a URL',
            'search.submitTooltip': 'Search',
            'tabs.bookmarks': 'Bookmarks',
            'tabs.mostVisited': 'Most Visited',
            'tabs.recentlyAdded': 'Recently Added',
            'tabs.all': 'All',
            'breadcrumbs.home': 'Home',
            'breadcrumbs.all': 'All Bookmarks',
            'breadcrumbs.search': 'Search: "{{term}}"',
            'bookmarkSearch.placeholder': 'Search your bookmarks...',
            'sort.name': 'Sort by Name',
            'sort.date': 'Sort by Date',
            'sort.url': 'Sort by URL',
            'filter.all': 'All Bookmarks',
            'filter.today': 'Added Today',
            'filter.week': 'This Week',
            'filter.month': 'This Month',
            'view.gridTooltip': 'Grid View',
            'view.listTooltip': 'List View',
            'loading.message': 'Loading bookmarks...',
            'support.cta': 'Support My Work',
            'backToTop.tooltip': 'Go to top',
            'toast.settingsSaved': 'Settings saved successfully!',
            'toast.errorLoadingBookmarks': 'Error loading bookmarks',
            'toast.bookmarkCreated': 'Bookmark created successfully!',
            'toast.bookmarkCreateError': 'Error creating bookmark: {{message}}',
            'toast.bookmarkUpdated': 'Bookmark updated successfully!',
            'toast.bookmarkUpdateError': 'Error updating bookmark: {{message}}',
            'toast.bookmarkDeleted': 'Bookmark deleted successfully!',
            'toast.bookmarkDeleteError': 'Error deleting bookmark: {{message}}',
            'toast.bookmarkDeleteGenericError': 'Error deleting bookmark',
            'toast.fillTitleAndUrl': 'Please fill in title and URL',
            'toast.bookmarkReordered': 'Bookmark position updated!',
            'empty.noBookmarks': 'No bookmarks found.',
            'bookmark.untitled': 'Untitled',
            'bookmark.unknownHost': 'unknown',
            'confirm.deleteBookmark': 'Are you sure you want to delete this bookmark?',
            'bookmark.action.open': 'Open bookmark',
            'bookmark.action.edit': 'Edit bookmark',
            'bookmark.action.delete': 'Delete bookmark'
        },
        ar: {
            'app.title': 'مدير العلامات المحترف',
            'modal.settings.title': 'الإعدادات',
            'settings.gridSize': 'حجم الشبكة:',
            'settings.gridSmall': 'صغير',
            'settings.gridMedium': 'متوسط',
            'settings.gridLarge': 'كبير',
            'settings.defaultEngine': 'محرك البحث الافتراضي:',
            'settings.engine.google': 'جوجل',
            'settings.engine.bing': 'بينغ',
            'settings.engine.duckduckgo': 'دك دك غو',
            'settings.engine.yahoo': 'ياهو',
            'settings.showMostVisited': 'عرض الأكثر زيارة:',
            'settings.showRecentlyAdded': 'عرض المضافة حديثًا:',
            'settings.animationsEnabled': 'تفعيل الحركات:',
            'settings.save': 'حفظ الإعدادات',
            'settings.reset': 'إعادة الضبط للوضع الافتراضي',
            'modal.addBookmark.title': 'إضافة علامة مرجعية',
            'modal.fields.title': 'العنوان:',
            'modal.fields.url': 'الرابط:',
            'modal.fields.folder': 'المجلد:',
            'modal.fields.selectFolder': 'اختر مجلدًا...',
            'modal.fields.tags': 'الوسوم (مفصولة بفاصلة):',
            'modal.placeholders.title': 'أدخل عنوان العلامة المرجعية',
            'modal.placeholders.url': 'https://example.com',
            'modal.placeholders.tags': 'عمل، مهم، مرجع',
            'modal.addBookmark.save': 'حفظ العلامة',
            'modal.editBookmark.title': 'تحرير العلامة المرجعية',
            'modal.editBookmark.update': 'تحديث العلامة',
            'modal.editBookmark.delete': 'حذف العلامة',
            'common.cancel': 'إلغاء',
            'header.title': 'مدير العلامات المحترف',
            'header.addBookmarkTooltip': 'إضافة علامة مرجعية',
            'header.settingsTooltip': 'الإعدادات',
            'header.toggleDarkModeTooltip': 'تبديل الوضع الليلي',
            'language.selector': 'محدد اللغة',
            'language.english': 'English',
            'language.arabic': 'العربية',
            'search.placeholder': 'ابحث أو اكتب عنوان URL',
            'search.submitTooltip': 'بحث',
            'tabs.bookmarks': 'العلامات',
            'tabs.mostVisited': 'الأكثر زيارة',
            'tabs.recentlyAdded': 'المضافة حديثًا',
            'tabs.all': 'الكل',
            'breadcrumbs.home': 'الصفحة الرئيسية',
            'breadcrumbs.all': 'جميع العلامات',
            'breadcrumbs.search': 'نتائج البحث: "{{term}}"',
            'bookmarkSearch.placeholder': 'ابحث في علاماتك...',
            'sort.name': 'ترتيب حسب الاسم',
            'sort.date': 'ترتيب حسب التاريخ',
            'sort.url': 'ترتيب حسب الرابط',
            'filter.all': 'جميع العلامات',
            'filter.today': 'أضيفت اليوم',
            'filter.week': 'هذا الأسبوع',
            'filter.month': 'هذا الشهر',
            'view.gridTooltip': 'عرض الشبكة',
            'view.listTooltip': 'عرض القائمة',
            'loading.message': 'جارٍ تحميل العلامات...',
            'support.cta': 'ادعم عملي',
            'backToTop.tooltip': 'إلى الأعلى',
            'toast.settingsSaved': 'تم حفظ الإعدادات بنجاح!',
            'toast.errorLoadingBookmarks': 'حدث خطأ أثناء تحميل العلامات',
            'toast.bookmarkCreated': 'تم إنشاء العلامة بنجاح!',
            'toast.bookmarkCreateError': 'حدث خطأ عند إنشاء العلامة: {{message}}',
            'toast.bookmarkUpdated': 'تم تحديث العلامة بنجاح!',
            'toast.bookmarkUpdateError': 'حدث خطأ عند تحديث العلامة: {{message}}',
            'toast.bookmarkDeleted': 'تم حذف العلامة بنجاح!',
            'toast.bookmarkDeleteError': 'حدث خطأ عند حذف العلامة: {{message}}',
            'toast.bookmarkDeleteGenericError': 'حدث خطأ عند حذف العلامة',
            'toast.fillTitleAndUrl': 'يرجى إدخال العنوان والرابط',
            'toast.bookmarkReordered': 'تم تحديث موضع العلامة!',
            'empty.noBookmarks': 'لا توجد علامات.',
            'bookmark.untitled': 'بدون عنوان',
            'bookmark.unknownHost': 'غير معروف',
            'confirm.deleteBookmark': 'هل أنت متأكد أنك تريد حذف هذه العلامة؟',
            'bookmark.action.open': 'فتح العلامة',
            'bookmark.action.edit': 'تحرير العلامة',
            'bookmark.action.delete': 'حذف العلامة'
        }
    };

    const translate = (key, replacements = {}) => {
        const lang = settings.language || 'en';
        const template = translations[lang]?.[key] ?? translations.en[key] ?? key;
        return Object.keys(replacements).reduce(
            (result, placeholder) =>
                result.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), replacements[placeholder]),
            template
        );
    };

    const applyLocalization = () => {
        currentLanguage = settings.language || 'en';
        const isRTL = currentLanguage === 'ar';

        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', isRTL);

        if (languageSelect) {
            languageSelect.value = currentLanguage;
            languageSelect.dir = isRTL ? 'rtl' : 'ltr';
        }

        document.title = translate('app.title');

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            element.textContent = translate(element.dataset.i18n);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder));
        });

        document.querySelectorAll('[data-i18n-title]').forEach((element) => {
            element.setAttribute('title', translate(element.dataset.i18nTitle));
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
            element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
        });

        document.querySelectorAll('[data-i18n-option]').forEach((element) => {
            element.textContent = translate(element.dataset.i18nOption);
        });

        if (currentBreadcrumbPath.length > 0) {
            updateBreadcrumbs(currentBreadcrumbPath);
        }

        refreshLocalizedView();
    };

    const refreshLocalizedView = () => {
        if (!isDataLoaded) {
            return;
        }
        switch (currentView) {
            case 'most-visited':
                renderBookmarks(mostVisitedItems, mostVisitedGrid);
                break;
            case 'recently-added':
                renderBookmarks(recentlyAddedItems, recentlyAddedGrid);
                break;
            default: {
                const searchTerm = bookmarkSearchBar.value.trim();
                if (searchTerm.length > 0) {
                    handleBookmarkSearch({ target: bookmarkSearchBar });
                } else if (currentFolder) {
                    renderBookmarks(flattenBookmarks([currentFolder]), bookmarkGrid);
                } else {
                    renderBookmarks(allBookmarks, bookmarkGrid);
                }
                break;
            }
        }
    };

    const setLanguage = (lang) => {
        const normalized = translations[lang] ? lang : 'en';
        if (settings.language === normalized) {
            applyLocalization();
            return;
        }
        settings.language = normalized;
        if (languageSelect) {
            languageSelect.value = normalized;
        }
        persistSettings();
        applyLocalization();
    };

    // --- Main Initialization ---
    /**
     * Initialize application: settings, events, dark mode, and initial data.
     */
    const initialize = () => {
        loadSettings();
        setupEventListeners();
        setupDarkMode();
        loadInitialBookmarks();
        updateSearchEngine();
        applySettings();
    };

    // --- Performance Helpers ---
    /**
     * Debounce a function to run after no calls for 'wait' ms.
     * @param {Function} fn
     * @param {number} wait
     * @returns {Function}
     */
    const debounce = (fn, wait = 200) => {
        let timeoutId;
        return function debounced(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    /**
     * Throttle a function to run at most once every 'limit' ms.
     * @param {Function} fn
     * @param {number} limit
     * @returns {Function}
     */
    const throttle = (fn, limit = 100) => {
        let inThrottle = false;
        let lastArgs;
        return function throttled(...args) {
            lastArgs = args;
            if (!inThrottle) {
                fn.apply(this, lastArgs);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                    if (lastArgs !== args) {
                        fn.apply(this, lastArgs);
                    }
                }, limit);
            }
        };
    };

    // --- Settings Management ---
    /** Load settings from localStorage and merge with defaults. */
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('bookmarkViewerSettings');
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
        if (!settings.language || !translations[settings.language]) {
            settings.language = 'en';
    }
    };

    const persistSettings = () => {
        localStorage.setItem('bookmarkViewerSettings', JSON.stringify(settings));
    };

    /** Save current settings to localStorage and apply them. */
    const saveSettings = () => {
        persistSettings();
        applySettings();
        showToast(translate('toast.settingsSaved'), 'success');
    };

    /** Reflect current settings to the UI (grid size, animations, tabs). */
    const applySettings = () => {
        // Apply grid size
        bookmarkGrid.className = `bookmark-grid ${settings.gridSize}`;
        mostVisitedGrid.className = `bookmark-grid ${settings.gridSize} hidden`;
        recentlyAddedGrid.className = `bookmark-grid ${settings.gridSize} hidden`;
        
        // Apply animations
        if (!settings.animationsEnabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        
        // Update UI elements
        gridSize.value = settings.gridSize;
        defaultSearchEngine.value = settings.defaultSearchEngine;
        showMostVisited.checked = settings.showMostVisited;
        showRecentlyAdded.checked = settings.showRecentlyAdded;
        animationsEnabled.checked = settings.animationsEnabled;
        if (languageSelect) {
            languageSelect.value = settings.language || 'en';
        }
        
        updateSearchEngine();
        updateQuickAccessTabs();
        applyLocalization();
    };

    /** Update search engine logo and classes according to default engine. */
    const updateSearchEngine = () => {
        const engine = searchEngines[settings.defaultSearchEngine];
        if (engine) {
            searchEngineLogo.src = engine.logo;
            searchEngineLogo.alt = engine.name + ' Logo';
            searchEngineLogo.classList.remove('google-logo', 'yahoo-logo');
            if (engine.name === 'Google') {
                searchEngineLogo.classList.add('google-logo');
            } else if (engine.name === 'Yahoo') {
                searchEngineLogo.classList.add('yahoo-logo');
            }
        }
    };

    /** Show/hide quick-access tabs based on settings toggles. */
    const updateQuickAccessTabs = () => {
        const mostVisitedTab = document.querySelector('[data-tab="most-visited"]');
        const recentlyAddedTab = document.querySelector('[data-tab="recently-added"]');
        
        if (mostVisitedTab) {
            mostVisitedTab.style.display = settings.showMostVisited ? 'flex' : 'none';
        }
        if (recentlyAddedTab) {
            recentlyAddedTab.style.display = settings.showRecentlyAdded ? 'flex' : 'none';
        }
    };

    // --- Event Listeners Setup ---
    /** Register all event listeners for inputs, controls, modals, and shortcuts. */
    const setupEventListeners = () => {
        // Search functionality
        const debouncedWebSearchInput = debounce(handleSearchInput, 200);
        searchInput.addEventListener('input', debouncedWebSearchInput);
        searchForm.addEventListener('submit', handleSearch);
        const debouncedBookmarkSearch = debounce(handleBookmarkSearch, 150);
        bookmarkSearchBar.addEventListener('input', debouncedBookmarkSearch);
        
        // Dark mode toggle
        darkModeToggle.addEventListener('click', toggleDarkMode);

        // Language switcher
        if (languageSelect) {
            languageSelect.addEventListener('change', (event) => {
                setLanguage(event.target.value);
            });
        }
        
        // Folder navigation
        primaryFolderTabs.addEventListener('click', handlePrimaryTabClick);
        subFolderTabs.addEventListener('click', handleSubTabClick);
        breadcrumbs.addEventListener('click', handleBreadcrumbClick);
        
        // Quick access tabs
        quickTabs.forEach(tab => {
            tab.addEventListener('click', handleQuickTabClick);
        });
        
        // View controls
        sortBy.addEventListener('change', handleSortChange);
        filterBy.addEventListener('change', handleFilterChange);
        gridViewBtn.addEventListener('click', () => setViewMode('grid'));
        listViewBtn.addEventListener('click', () => setViewMode('list'));
        
        // Modal controls
        settingsBtn.addEventListener('click', () => openModal(settingsModal));
        addBookmarkBtn.addEventListener('click', () => openModal(addBookmarkModal));
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', closeModals);
        });
        
        // Modal background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModals();
            });
        });
        
        // Settings form
        document.getElementById('saveSettings').addEventListener('click', handleSaveSettings);
        document.getElementById('resetSettings').addEventListener('click', handleResetSettings);
        
        // Bookmark form
        document.getElementById('saveBookmark').addEventListener('click', handleSaveBookmark);
        document.getElementById('cancelBookmark').addEventListener('click', closeModals);
        
        // Edit bookmark form
        document.getElementById('updateBookmark').addEventListener('click', handleUpdateBookmark);
        document.getElementById('deleteBookmark').addEventListener('click', handleDeleteBookmark);
        document.getElementById('cancelEditBookmark').addEventListener('click', closeModals);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Window click to close modals
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModals();
            }
        });

        // Back to Top
        if (backToTopBtn) {
            const updateBackToTopVisibility = throttle(() => {
                if (window.scrollY > 200) {
                    backToTopBtn.classList.remove('hidden');
                } else {
                    backToTopBtn.classList.add('hidden');
                }
            }, 120);

            window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    // --- Bookmark Loading and Management ---
    /** Load and render initial bookmark data and tabs. */
    const loadInitialBookmarks = async () => {
        showLoading(true);
        try {
            bookmarkTree = await chrome.bookmarks.getTree();
            allBookmarks = flattenBookmarks(bookmarkTree);
            
            const rootFolders = bookmarkTree[0].children.filter(node => node.children && node.title);
            renderFolderTabs(rootFolders, primaryFolderTabs, true);
            
            // Load most visited and recently added
            //if (settings.showMostVisited) {
                loadMostVisited();
            //}
            if (settings.showRecentlyAdded) {
                loadRecentlyAdded();
            }
            
            // Activate first tab
            const firstTab = primaryFolderTabs.querySelector('.folder-tab');
            if (firstTab) {
                firstTab.click();
            }
            
            // Populate folder dropdowns in modals
            populateFolderDropdowns();
            isDataLoaded = true;
            refreshLocalizedView();
            
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            showToast(translate('toast.errorLoadingBookmarks'), 'error');
        } finally {
            showLoading(false);
        }
    };

    /** Load most visited sites and render. */
    const loadMostVisited = async () => {
        try {
            const mostVisited = await new Promise((resolve) => {
                chrome.topSites.get(resolve);
            });
            mostVisitedItems = mostVisited.slice(0, 12);
            renderBookmarks(mostVisitedItems, mostVisitedList, 'icon');
        } catch (error) {
            console.error('Error loading most visited:', error);
        }
    };

    /** Compute recently added bookmarks from flattened list and render. */
    const loadRecentlyAdded = () => {
        const recentBookmarks = allBookmarks
            .filter(bookmark => bookmark.dateAdded)
            .sort((a, b) => b.dateAdded - a.dateAdded)
            .slice(0, 12);
        recentlyAddedItems = recentBookmarks;
        renderBookmarks(recentlyAddedItems, recentlyAddedGrid);
    };

    /** Populate folder selects in Add/Edit modals with current folders. */
    const populateFolderDropdowns = () => {
        const folders = getFolderList(bookmarkTree);
        const dropdowns = [
            document.getElementById('bookmarkFolder'),
            document.getElementById('editBookmarkFolder')
        ];
        
        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = `<option value="" data-i18n="modal.fields.selectFolder">${translate('modal.fields.selectFolder')}</option>`;
            folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder.id;
                option.textContent = folder.title;
                dropdown.appendChild(option);
            });
        });
    };

    /**
     * Create a flat list of folders for selects from bookmark tree.
     * @param {Array} nodes
     * @param {string} prefix
     * @returns {Array<{id: string, title: string}>}
     */
    const getFolderList = (nodes, prefix = '') => {
        let folders = [];
        for (const node of nodes) {
            if (node.children ) {
                folders.push({
                    id: node.id,
                    title: prefix + node.title
                });
                folders = folders.concat(getFolderList(node.children, prefix + node.title + ' / '));
            }
        }
        return folders;
    };

    // --- Event Handlers ---
    /** Handle main search submission. */
    const handleSearch = (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            try {
                new URL(query);
                const url = query.includes('://') ? query : `https://${query}`;
                chrome.tabs.update({ url });
            } catch (_) {
                const engine = searchEngines[settings.defaultSearchEngine];
                const searchUrl = engine.searchUrl + encodeURIComponent(query);
                chrome.tabs.update({ url: searchUrl });
            }
        }
    };

    // Consolidated handleSearchInput for web search suggestions
    /** Handle web search input for suggestions. */
    const handleSearchInput = (event) => {
        const query = event.target.value.trim();
        if (query.length > 0) {
            fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`)
                .then(response => response.json())
                .then(data => {
                    const suggestions = data[1];
                    renderSuggestions(suggestions);
                });
        } else {
            document.getElementById('suggestions-container').style.display = 'none';
        }
    };

    // Consolidated renderSuggestions for web search suggestions
    /** Render web search suggestions dropdown. */
    const renderSuggestions = (suggestions) => {
        const suggestionsContainer = document.getElementById('suggestions-container');
        suggestionsContainer.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = suggestion;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    handleSearch(new Event('submit'));
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    };

    /** Filter bookmarks as user types in the bookmark search bar. */
    const handleBookmarkSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            // Restore previous view
            restorePreviousView();
            
            return;
        }

        // Filter bookmarks
        const filteredBookmarks = allBookmarks.filter(bookmark =>
            bookmark.title.toLowerCase().includes(searchTerm) ||
            bookmark.url.toLowerCase().includes(searchTerm)
        );
        
        renderBookmarks(filteredBookmarks, bookmarkGrid);
        
        // Clear active tabs to indicate search mode
        document.querySelectorAll('.folder-tab').forEach(tab => tab.classList.remove('active'));
        updateBreadcrumbs([{ id: 'search', term: searchTerm }]);
    };

    /** Handle primary folder tab click. */
    const handlePrimaryTabClick = (event) => {
        const clickedTab = event.target.closest('.folder-tab');
        if (!clickedTab) return;

        primaryFolderTabs.querySelectorAll('.folder-tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        
        clearSearch();
        const folderId = clickedTab.dataset.id;
        
        if (folderId === 'all') {
            subFolderTabs.innerHTML = '';
            renderBookmarks(allBookmarks, bookmarkGrid);
            currentFolder = null;
            updateBreadcrumbs([{ id: 'all' }]);
        } else {
            chrome.bookmarks.getSubTree(folderId, (result) => {
                const folderNode = result[0];
                currentFolder = folderNode;
                const subFolders = folderNode.children.filter(node => node.children);
                
                if (subFolders.length > 0) {
                    renderFolderTabs(subFolders, subFolderTabs, false);
                    const firstSubTab = subFolderTabs.querySelector('.folder-tab');
                    if (firstSubTab) firstSubTab.click();
                } else {
                    subFolderTabs.innerHTML = '';
                    renderBookmarks(flattenBookmarks([folderNode]), bookmarkGrid);
                    updateBreadcrumbs([{ title: folderNode.title, id: folderNode.id }]);
                }
            });
        }
    };

    /** Handle subfolder tab click. */
    const handleSubTabClick = (event) => {
        const clickedTab = event.target.closest('.folder-tab');
        if (!clickedTab) return;

        subFolderTabs.querySelectorAll('.folder-tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        
        clearSearch();
        const folderId = clickedTab.dataset.id;
        
        chrome.bookmarks.getSubTree(folderId, (result) => {
            const folderNode = result[0];
            renderBookmarks(flattenBookmarks(result), bookmarkGrid);
            
            // Update breadcrumbs
            const parentFolder = currentFolder || { title: 'Home', id: 'root' };
            updateBreadcrumbs([
                { title: parentFolder.title, id: parentFolder.id },
                { title: folderNode.title, id: folderNode.id }
            ]);
        });
    };

    /** Navigate using breadcrumbs. */
    const handleBreadcrumbClick = (event) => {
        const breadcrumbItem = event.target.closest('.breadcrumb-item');
        if (!breadcrumbItem) return;
        
        const folderId = breadcrumbItem.dataset.folderId;
        if (folderId === 'root') {
            // Go back to main view
            const firstTab = primaryFolderTabs.querySelector('.folder-tab');
            if (firstTab) firstTab.click();
        } else {
            // Navigate to specific folder
            chrome.bookmarks.getSubTree(folderId, (result) => {
                renderBookmarks(flattenBookmarks(result), bookmarkGrid);
            });
        }
    };

    /** Switch quick access tabs (bookmarks, most visited, recently added). */
    const handleQuickTabClick = (event) => {
        const tab = event.target.closest('.quick-tab');
        if (!tab) return;
        
        // Update active tab
        quickTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabType = tab.dataset.tab;
        currentView = tabType;
        
        // Hide all grids
        bookmarkGrid.classList.add('hidden');
        mostVisitedGrid.classList.add('hidden');
        recentlyAddedGrid.classList.add('hidden');
        
        // Show selected grid
        switch (tabType) {
            case 'bookmarks':
                bookmarkGrid.classList.remove('hidden');
                break;
            case 'most-visited':
                mostVisitedGrid.classList.remove('hidden');
                break;
            case 'recently-added':
                recentlyAddedGrid.classList.remove('hidden');
                break;
        }
        
        // Clear search when switching tabs
        clearSearch();
    };

    /** Sort current view bookmarks by selected criteria. */
    const handleSortChange = () => {
        const sortValue = sortBy.value;
        const currentBookmarks = getCurrentBookmarks();
        
        const sortedBookmarks = [...currentBookmarks].sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return a.title.localeCompare(b.title);
                case 'date':
                    return (b.dateAdded || 0) - (a.dateAdded || 0);
                case 'url':
                    return (a.url || '').localeCompare(b.url || '');
                default:
                    return 0;
            }
        });
        
        renderBookmarks(sortedBookmarks, getCurrentGrid());
    };

    /** Filter current view bookmarks by time window. */
    const handleFilterChange = () => {
        const filterValue = filterBy.value;
        const now = Date.now();
        const currentBookmarks = getCurrentBookmarks();
        
        let filteredBookmarks = currentBookmarks;
        
        switch (filterValue) {
            case 'today':
                filteredBookmarks = currentBookmarks.filter(bookmark => 
                    bookmark.dateAdded && (now - bookmark.dateAdded) < 24 * 60 * 60 * 1000
                );
                break;
            case 'week':
                filteredBookmarks = currentBookmarks.filter(bookmark => 
                    bookmark.dateAdded && (now - bookmark.dateAdded) < 7 * 24 * 60 * 60 * 1000
                );
                break;
            case 'month':
                filteredBookmarks = currentBookmarks.filter(bookmark => 
                    bookmark.dateAdded && (now - bookmark.dateAdded) < 30 * 24 * 60 * 60 * 1000
                );
                break;
        }
        
        renderBookmarks(filteredBookmarks, getCurrentGrid());
    };

    /** Apply and persist settings from the Settings modal. */
    const handleSaveSettings = () => {
        settings.gridSize = gridSize.value;
        settings.defaultSearchEngine = defaultSearchEngine.value;
        settings.showMostVisited = showMostVisited.checked;
        settings.showRecentlyAdded = showRecentlyAdded.checked;
        settings.animationsEnabled = animationsEnabled.checked;
        
        saveSettings();
        closeModals();
    };

    /** Reset settings to defaults except for darkMode and persist. */
    const handleResetSettings = () => {
        settings = {
            gridSize: 'medium',
            defaultSearchEngine: 'google',
            showMostVisited: true,
            showRecentlyAdded: true,
            animationsEnabled: true,
            darkMode: settings.darkMode,
            language: 'en'
        };
        saveSettings();
        closeModals();
    };

    /** Create a new bookmark from Add modal fields. */
    const handleSaveBookmark = () => {
        const title = document.getElementById('bookmarkTitle').value.trim();
        const url = document.getElementById('bookmarkUrl').value.trim();
        const folderId = document.getElementById('bookmarkFolder').value;
        const tags = document.getElementById('bookmarkTags').value.trim();
        
        if (!title || !url) {
            showToast(translate('toast.fillTitleAndUrl'), 'error');
            return;
        }
        
        const bookmarkData = {
            title: title,
            url: url,
            parentId: folderId || '1' // Default to bookmarks bar
        };
        
        chrome.bookmarks.create(bookmarkData, (result) => {
            if (chrome.runtime.lastError) {
                showToast(
                    translate('toast.bookmarkCreateError', { message: escapeHtml(chrome.runtime.lastError.message) }),
                    'error'
                );
            } else {
                showToast(translate('toast.bookmarkCreated'), 'success');
                closeModals();
                loadInitialBookmarks(); // Refresh bookmarks
            }
        });
    };

    /** Update bookmark values from Edit modal fields. */
    const handleUpdateBookmark = () => {
        const bookmarkId = editBookmarkModal.dataset.bookmarkId;
        const title = document.getElementById('editBookmarkTitle').value.trim();
        const url = document.getElementById('editBookmarkUrl').value.trim();
        
        if (!title || !url) {
            showToast(translate('toast.fillTitleAndUrl'), 'error');
            return;
        }
        
        chrome.bookmarks.update(bookmarkId, { title, url }, (result) => {
            if (chrome.runtime.lastError) {
                showToast(
                    translate('toast.bookmarkUpdateError', { message: escapeHtml(chrome.runtime.lastError.message) }),
                    'error'
                );
            } else {
                showToast(translate('toast.bookmarkUpdated'), 'success');
                closeModals();
                loadInitialBookmarks(); // Refresh bookmarks
            }
        });
    };

    /** Delete the currently edited bookmark after confirmation. */
    const handleDeleteBookmark = () => {
        const bookmarkId = editBookmarkModal.dataset.bookmarkId;
        
        if (confirm(translate('confirm.deleteBookmark'))) {
            chrome.bookmarks.remove(bookmarkId, () => {
                if (chrome.runtime.lastError) {
                    showToast(
                        translate('toast.bookmarkDeleteError', { message: escapeHtml(chrome.runtime.lastError.message) }),
                        'error'
                    );
                } else {
                    showToast(translate('toast.bookmarkDeleted'), 'success');
                    closeModals();
                    loadInitialBookmarks(); // Refresh bookmarks
                }
            });
        }
    };

    /** Global keyboard shortcuts for quick actions. */
    const handleKeyboardShortcuts = (event) => {
        // Ctrl/Cmd + K for search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + B for bookmark search
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
            event.preventDefault();
            bookmarkSearchBar.focus();
        }
        
        // Escape to close modals
        if (event.key === 'Escape') {
            closeModals();
        }
        
        // Ctrl/Cmd + D to add bookmark
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            openModal(addBookmarkModal);
        }
    };

    // --- Rendering Functions ---
    /** Escape text for safe HTML insertion. */
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    /** Render folder tabs into a container. */
    const renderFolderTabs = (folders, container, isPrimary) => {
        let tabsHtml = isPrimary ? `<button class="folder-tab" data-id="all">
            <svg class="icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.6 9H20.4M3.6 15H20.4M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.5 3C9.81538 5.69961 8.92224 8.81787 8.92224 12C8.92224 15.1821 9.81538 18.3004 11.5 21M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span data-i18n="tabs.all">${translate('tabs.all')}</span></button>` : '';
        tabsHtml += folders.map(folder => 
            `<button class="folder-tab" data-id="${folder.id}">
                <svg class="icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.98 4.19667 3.45067 4.00067 4 4H10L12 6H20C20.55 6 21.021 6.196 21.413 6.588C21.805 6.98 22.0007 7.45067 22 8V18C22 18.55 21.8043 19.021 21.413 19.413C21.0217 19.805 20.5507 20.0007 20 20H4ZM4 18H20V8H11.175L9.175 6H4V18Z" fill="currentColor"/>
                </svg>
                ${folder.title}
            </button>`
        ).join('');
        container.innerHTML = tabsHtml;
    };

    /**
     * Render bookmark cards into the provided container.
     * @param {Array} bookmarks
     * @param {HTMLElement} container
     */
    const renderBookmarks = (bookmarks, container, displayType = 'grid') => {
        if (!bookmarks || bookmarks.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; opacity: 0.7;">
                    <i class="fas fa-bookmark" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p style="font-size: 16px; margin: 0;">${translate('empty.noBookmarks')}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = bookmarks.map(bookmark => {
            if (!bookmark.url) return '';
            
            let hostname = '';
            let fallbackHostname = false;
            try {
                hostname = new URL(bookmark.url).hostname;
            } catch (_) {
                // Fallback: attempt to prepend https and retry
                try {
                    hostname = new URL(`https://${bookmark.url}`).hostname;
                } catch {
                    hostname = bookmark.url.replace(/^https?:\/\//, '').split('/')[0] || 'unknown';
                    fallbackHostname = true;
                }
            }
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
            const displayUrl = fallbackHostname ? translate('bookmark.unknownHost') : hostname;
            const safeDisplayUrl = escapeHtml(displayUrl);
            
            if(displayType === 'grid'){
                return `
                <div class="bookmark" data-bookmark-id="${bookmark.id}" draggable="true">
                    <img class="bookmark-favicon" src="${faviconUrl}" alt="">
                    <div class="bookmark-content">
                        <h3>${escapeHtml(bookmark.title) || translate('bookmark.untitled')}</h3>
                        <div class="url">${safeDisplayUrl}</div>
                    </div>
                    <div class="bookmark-actions">
                        <button class="bookmark-action open" title="${translate('bookmark.action.open')}">
                            <i class="fas fa-external-link"></i>
                        </button>
                        <button class="bookmark-action edit" title="${translate('bookmark.action.edit')}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bookmark-action delete" title="${translate('bookmark.action.delete')}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            }else{
                return `
                <div class="icon-container">
                    <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer" title="${bookmark.title}">
                        <div class="bookmark-icon icon" data-bookmark-id="${bookmark.id}">
                            <img class="bookmark-favicon" src="${faviconUrl}" alt="">
                        </div>  
                    </a>
                    <div class="bookmark-content">
                        <div class="url">${safeDisplayUrl}</div>
                    </div>
                </div>
                `;


            }
        }).join('');

        // Add event listeners to bookmarks
        container.querySelectorAll('.bookmark').forEach(bookmarkElement => {
            const bookmarkId = bookmarkElement.dataset.bookmarkId;
            const bookmark = bookmarks.find(b => b.id === bookmarkId);
            
            // Click to open bookmark
            bookmarkElement.addEventListener('click', (e) => {
                if (!e.target.closest('.bookmark-action')) {
                    e.preventDefault();
                    chrome.tabs.update({ url: bookmark.url });
                }
            });

            // Open bookmark
            const openBtn = bookmarkElement.querySelector('.open');
            if (openBtn) {
                openBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.open(bookmark.url, "_blank");
                });
            }
            
            
            // Edit bookmark
            const editBtn = bookmarkElement.querySelector('.edit');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditBookmarkModal(bookmark);
                });
            }
            
            // Delete bookmark
            const deleteBtn = bookmarkElement.querySelector('.delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(translate('confirm.deleteBookmark'))) {
                        chrome.bookmarks.remove(bookmarkId, () => {
                            if (chrome.runtime.lastError) {
                                showToast(translate('toast.bookmarkDeleteGenericError'), 'error');
                            } else {
                                showToast(translate('toast.bookmarkDeleted'), 'success');
                                loadInitialBookmarks();
                            }
                        });
                    }
                });
            }
            
            // Drag and drop
            bookmarkElement.addEventListener('dragstart', handleDragStart);
            bookmarkElement.addEventListener('dragover', handleDragOver);
            bookmarkElement.addEventListener('drop', handleDrop);
            bookmarkElement.addEventListener('dragend', handleDragEnd);
        });

         applyFaviconFallbacks(container);
    };


    const FALLBACK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' ry='6' fill='%23e5e7eb'/%3E%3Cpath d='M9 10h14v2H9zm0 5h10v2H9zm0 5h6v2H9z' fill='%234b5563'/%3E%3C/svg%3E";

    const applyFaviconFallbacks = (root) => {
    if (!root) return;
    root.querySelectorAll('img.bookmark-favicon').forEach((img) => {
        img.addEventListener('error', () => {
        if (img.dataset.faviconFallbackApplied === '1') return;
        img.dataset.faviconFallbackApplied = '1';
        img.src = FALLBACK_FAVICON;
        });
    });
    };

    // --- Drag and Drop Functions ---
    /** Begin dragging a bookmark card. */
    const handleDragStart = (e) => {
        draggedBookmarkEl = e.target.closest('.bookmark');
        draggedBookmarkEl.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    };

    /** Allow drop over other bookmark cards. */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    /** Swap positions of dragged and target bookmark cards. */
    const handleDrop = (e) => {
        e.preventDefault();
        const targetBookmark = e.target.closest('.bookmark');
        
        if (targetBookmark && targetBookmark !== draggedBookmarkEl) {
            // Swap positions (simplified implementation)
            const container = targetBookmark.parentNode;
            const draggedIndex = Array.from(container.children).indexOf(draggedBookmarkEl);
            const targetIndex = Array.from(container.children).indexOf(targetBookmark);
            
            if (draggedIndex < targetIndex) {
                container.insertBefore(draggedBookmarkEl, targetBookmark.nextSibling);
            } else {
                container.insertBefore(draggedBookmarkEl, targetBookmark);
            }
            
            showToast(translate('toast.bookmarkReordered'), 'success');
        }
    };

    /** Clean up after dragging ends. */
    const handleDragEnd = (e) => {
        if (draggedBookmarkEl) {
            draggedBookmarkEl.classList.remove('dragging');
            draggedBookmarkEl = null;
        }
    };

    // --- Modal Functions ---
    /** Open a modal dialog and focus the first input. */
    const openModal = (modal) => {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    };

    /** Close all open modal dialogs and clear inputs. */
    const closeModals = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        });
        
        // Clear form data
        document.querySelectorAll('.modal input, .modal select, .modal textarea').forEach(input => {
            if (input.type !== 'checkbox') {
                input.value = '';
            }
        });
    };

    /** Open the Edit Bookmark modal and prefill fields. */
    const openEditBookmarkModal = (bookmark) => {
        document.getElementById('editBookmarkTitle').value = bookmark.title;
        document.getElementById('editBookmarkUrl').value = bookmark.url;
        editBookmarkModal.dataset.bookmarkId = bookmark.id;
        openModal(editBookmarkModal);
    };

    // --- Utility Functions ---
    /** Flatten a bookmarks tree into a linear list of bookmark nodes. */
    const flattenBookmarks = (nodes) => {
        let bookmarks = [];
        for (const node of nodes) {
            if (node.children) {
                bookmarks = bookmarks.concat(flattenBookmarks(node.children));
            } else if (node.url) {
                bookmarks.push(node);
            }
        }
        return bookmarks;
    };

    /** Get the list of bookmarks represented by the current visible view. */
    const getCurrentBookmarks = () => {
        switch (currentView) {
            case 'most-visited':
                return Array.from(mostVisitedGrid.querySelectorAll('.bookmark')).map(el => ({
                    id: el.dataset.bookmarkId,
                    title: el.querySelector('h3').textContent,
                    url: el.querySelector('.url').textContent
                }));
            case 'recently-added':
                return Array.from(recentlyAddedGrid.querySelectorAll('.bookmark')).map(el => ({
                    id: el.dataset.bookmarkId,
                    title: el.querySelector('h3').textContent,
                    url: el.querySelector('.url').textContent
                }));
            default:
                return allBookmarks;
        }
    };

    /** Return the DOM grid element for the current view. */
    const getCurrentGrid = () => {
        switch (currentView) {
            case 'most-visited':
                return mostVisitedGrid;
            case 'recently-added':
                return recentlyAddedGrid;
            default:
                return bookmarkGrid;
        }
    };

    /** Toggle between grid and list view modes for all grids. */
    const setViewMode = (mode) => {
        const grids = [bookmarkGrid, mostVisitedGrid, recentlyAddedGrid];
        
        grids.forEach(grid => {
            if (mode === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
        
        // Update button states
        gridViewBtn.classList.toggle('active', mode === 'grid');
        listViewBtn.classList.toggle('active', mode === 'list');
    };

    const getBreadcrumbLabel = (item) => {
        if (item.translationKey) {
            return translate(item.translationKey, item.replacements || {});
        }
        if (item.id === 'root') {
            return translate('breadcrumbs.home');
        }
        if (item.id === 'all') {
            return translate('breadcrumbs.all');
        }
        if (item.id === 'search') {
            const term = escapeHtml(item.term ?? item.title ?? '');
            return translate('breadcrumbs.search', { term });
        }
        return escapeHtml(item.title || '');
    };

    /** Render breadcrumbs along the provided path list. */
    const updateBreadcrumbs = (path) => {
        currentBreadcrumbPath = path.map((item) => ({ ...item }));
        breadcrumbs.innerHTML = path.map((item, index) => {
            const isLast = index === path.length - 1;
            const label = getBreadcrumbLabel(item);
            const icon = item.id === 'root' ? '<i class="fas fa-home"></i>' : '';
            return `<span class="breadcrumb-item ${isLast ? 'active' : ''}" data-folder-id="${item.id}">
                ${icon} ${label}
            </span>`;
        }).join('');
    };

    /** Clear bookmark search input if any. */
    const clearSearch = () => {
        if (bookmarkSearchBar.value) {
            bookmarkSearchBar.value = '';
        }
    };

    /** Restore previous folder view after clearing search filter. */
    const restorePreviousView = () => {
        const activeSubTab = subFolderTabs.querySelector('.folder-tab.active');
        if (activeSubTab) {
            activeSubTab.click();
        } else {
            const activePrimaryTab = primaryFolderTabs.querySelector('.folder-tab.active');
            if (activePrimaryTab) {
                activePrimaryTab.click();
            }
        }
    };

    /** Show or hide the loading spinner overlay. */
    const showLoading = (show) => {
        if (show) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    };

    /**
     * Display a toast message for a short duration.
     * @param {string} message
     * @param {'info'|'success'|'error'|'warning'} type
     */
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };

    /** Toggle dark mode UI and persist preference. */
    const toggleDarkMode = () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        settings.darkMode = isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update icon
        const icon = darkModeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    };

    /** Initialize dark mode state from persisted preference. */
    const setupDarkMode = () => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            settings.darkMode = true;
        }
        
        // Update icon
        const icon = darkModeToggle.querySelector('i');
        icon.className = settings.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    };

    // --- Initialize Application ---
    initialize();

    window.addEventListener('storage', e => {
        toggleDarkMode();
    });
});



