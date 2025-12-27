/**
 * CalendarEngine - Core calendar functionality for 2026 multilingual calendar
 * Handles date calculations, month navigation, and calendar grid generation
 */
class CalendarEngine {
    constructor(year = 2026) {
        this.year = year;
        this.currentDate = new Date(year, 0, 1); // Start with January 2026
        this.today = new Date();
        
        // Month names in English and Chinese
        this.monthNames = {
            en: ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'],
            zh: ['一月', '二月', '三月', '四月', '五月', '六月',
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
        };
        
        // Day names for calendar headers
        this.dayNames = {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            zh: ['日', '一', '二', '三', '四', '五', '六']
        };
    }

    /**
     * Generate calendar grid for the specified month and year
     * @param {number} month - Month (0-11)
     * @param {number} year - Year
     * @returns {Array} Array of date objects for the calendar grid
     */
    generateMonthGrid(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const grid = [];
        
        // Add previous month's trailing days
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            grid.push({
                day: daysInPrevMonth - i,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                isToday: false,
                isWeekend: false
            });
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const isToday = this.isToday(date);
            const isWeekend = this.isWeekend(date);
            
            grid.push({
                day: day,
                month: month,
                year: year,
                isCurrentMonth: true,
                isToday: isToday,
                isWeekend: isWeekend,
                date: date
            });
        }
        
        // Add next month's leading days to complete the grid (42 cells total)
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        const remainingCells = 42 - grid.length;
        
        for (let day = 1; day <= remainingCells; day++) {
            grid.push({
                day: day,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false,
                isToday: false,
                isWeekend: false
            });
        }
        
        return grid;
    }

    /**
     * Navigate to a specific month and year
     * @param {number} month - Month (0-11)
     * @param {number} year - Year
     */
    navigateToMonth(month, year) {
        // Ensure we stay within 2026 bounds
        if (year < 2026 || year > 2026) {
            return false;
        }
        
        this.currentDate = new Date(year, month, 1);
        return true;
    }

    /**
     * Get current date information
     * @returns {Date} Current date
     */
    getCurrentDate() {
        return new Date(this.currentDate);
    }

    /**
     * Check if a date is a weekend (Saturday or Sunday)
     * @param {Date} date - Date to check
     * @returns {boolean} True if weekend
     */
    isWeekend(date) {
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    }

    /**
     * Check if a date is today
     * @param {Date} date - Date to check
     * @returns {boolean} True if today
     */
    isToday(date) {
        return date.toDateString() === this.today.toDateString();
    }

    /**
     * Navigate to previous month
     * @returns {boolean} Success status
     */
    previousMonth() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        if (currentMonth === 0 && currentYear === 2026) {
            // Already at January 2026, can't go back further
            return false;
        }
        
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        return this.navigateToMonth(newMonth, newYear);
    }

    /**
     * Navigate to next month
     * @returns {boolean} Success status
     */
    nextMonth() {
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        if (currentMonth === 11 && currentYear === 2026) {
            // Already at December 2026, can't go forward further
            return false;
        }
        
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        
        return this.navigateToMonth(newMonth, newYear);
    }

    /**
     * Get month name in specified language
     * @param {number} month - Month (0-11)
     * @param {string} language - Language code ('en' or 'zh')
     * @returns {string} Month name
     */
    getMonthName(month, language = 'en') {
        return this.monthNames[language][month];
    }

    /**
     * Get day names for calendar headers
     * @param {string} language - Language code ('en' or 'zh')
     * @returns {Array} Array of day names
     */
    getDayNames(language = 'en') {
        return this.dayNames[language];
    }
}

/**
 * FlowerImageManager - Manages Portuguese flower display for each month
 */
class FlowerImageManager {
    constructor() {
        // Portuguese flowers for each month as specified in requirements
        this.monthlyFlowers = {
            0: { // January
                portuguese: 'Camélia',
                english: 'Camellia',
                chinese: '山茶花',
                emoji: '🌺'
            },
            1: { // February
                portuguese: 'Flor de Amendoeira',
                english: 'Almond Blossom',
                chinese: '杏花',
                emoji: '🌸'
            },
            2: { // March
                portuguese: 'Narciso',
                english: 'Daffodil',
                chinese: '水仙花',
                emoji: '🌼'
            },
            3: { // April
                portuguese: 'Flor de Cerejeira',
                english: 'Cherry Blossom',
                chinese: '樱花',
                emoji: '🌸'
            },
            4: { // May
                portuguese: 'Rosa',
                english: 'Rose',
                chinese: '玫瑰',
                emoji: '🌹'
            },
            5: { // June
                portuguese: 'Alfazema',
                english: 'Lavender',
                chinese: '薰衣草',
                emoji: '💜'
            },
            6: { // July
                portuguese: 'Girassol',
                english: 'Sunflower',
                chinese: '向日葵',
                emoji: '🌻'
            },
            7: { // August
                portuguese: 'Buganvília',
                english: 'Bougainvillea',
                chinese: '三角梅',
                emoji: '🌺'
            },
            8: { // September
                portuguese: 'Dália',
                english: 'Dahlia',
                chinese: '大丽花',
                emoji: '🌼'
            },
            9: { // October
                portuguese: 'Crisântemo',
                english: 'Chrysanthemum',
                chinese: '菊花',
                emoji: '🌻'
            },
            10: { // November
                portuguese: 'Ciclâmen',
                english: 'Cyclamen',
                chinese: '仙客来',
                emoji: '🌺'
            },
            11: { // December
                portuguese: 'Bico-de-papagaio',
                english: 'Poinsettia',
                chinese: '一品红',
                emoji: '🌹'
            }
        };
    }

    /**
     * Get flower information for a specific month
     * @param {number} month - Month (0-11)
     * @returns {Object} Flower information
     */
    getMonthlyFlower(month) {
        return this.monthlyFlowers[month] || this.monthlyFlowers[0];
    }

    /**
     * Get flower info by name
     * @param {string} flowerName - Name of the flower
     * @returns {Object|null} Flower information or null if not found
     */
    getFlowerInfo(flowerName) {
        for (const month in this.monthlyFlowers) {
            const flower = this.monthlyFlowers[month];
            if (flower.portuguese === flowerName || 
                flower.english === flowerName || 
                flower.chinese === flowerName) {
                return flower;
            }
        }
        return null;
    }

    /**
     * Apply seasonal theme based on month
     * @param {number} month - Month (0-11)
     * @returns {Object} Theme colors and styles
     */
    applySeasonalTheme(month) {
        const themes = {
            // Winter (Dec, Jan, Feb)
            winter: {
                primary: '#4a90e2',
                secondary: '#f5f7fa',
                accent: '#e74c3c'
            },
            // Spring (Mar, Apr, May)
            spring: {
                primary: '#2ecc71',
                secondary: '#ecf0f1',
                accent: '#e91e63'
            },
            // Summer (Jun, Jul, Aug)
            summer: {
                primary: '#f39c12',
                secondary: '#fff9e6',
                accent: '#9b59b6'
            },
            // Autumn (Sep, Oct, Nov)
            autumn: {
                primary: '#d35400',
                secondary: '#fdf2e9',
                accent: '#8e44ad'
            }
        };

        if (month >= 2 && month <= 4) return themes.spring;
        if (month >= 5 && month <= 7) return themes.summer;
        if (month >= 8 && month <= 10) return themes.autumn;
        return themes.winter;
    }
}

/**
 * MultilingualCalendar2026 - Main application class
 */
class MultilingualCalendar2026 {
    constructor() {
        this.calendarEngine = new CalendarEngine(2026);
        this.flowerManager = new FlowerImageManager();
        this.isLoading = false;
        this.errorState = false;
        
        this.init();
    }

    /**
     * Initialize the calendar application
     */
    init() {
        try {
            this.setupElements();
            this.setupEventListeners();
            this.setupErrorHandling();
            this.setupPerformanceOptimizations();
            this.render();
            this.showLoadingComplete();
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    /**
     * Set up DOM element references
     */
    setupElements() {
        // Core calendar elements
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentMonthEn = document.getElementById('currentMonth');
        this.currentMonthCh = document.getElementById('currentMonthCh');
        this.prevButton = document.getElementById('prevMonth');
        this.nextButton = document.getElementById('nextMonth');
        
        // Flower display elements
        this.flowerImage = document.getElementById('flowerImage');
        this.flowerNamePt = document.getElementById('flowerNamePt');
        this.flowerNameEn = document.getElementById('flowerNameEn');
        this.flowerNameCh = document.getElementById('flowerNameCh');
        
        // Daily content elements
        this.dailyContent = document.getElementById('dailyContent');
        this.dailyQuote = document.getElementById('dailyQuote');
        this.dailyFact = document.getElementById('dailyFact');
        this.dailyVocabulary = document.getElementById('dailyVocabulary');
        
        // Validate all required elements exist
        const requiredElements = [
            'calendarGrid', 'currentMonthEn', 'currentMonthCh', 
            'prevButton', 'nextButton', 'flowerImage'
        ];
        
        for (const elementName of requiredElements) {
            if (!this[elementName]) {
                throw new Error(`Required element ${elementName} not found`);
            }
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation event listeners with error handling
        this.prevButton.addEventListener('click', (e) => {
            try {
                e.preventDefault();
                this.navigatePrevious();
            } catch (error) {
                this.handleError('Navigation failed', error);
            }
        });

        this.nextButton.addEventListener('click', (e) => {
            try {
                e.preventDefault();
                this.navigateNext();
            } catch (error) {
                this.handleError('Navigation failed', error);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            try {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.navigatePrevious();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateNext();
                }
            } catch (error) {
                this.handleError('Keyboard navigation failed', error);
            }
        });

        // Window resize handler for responsive design
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                try {
                    this.handleResize();
                } catch (error) {
                    this.handleError('Resize handling failed', error);
                }
            }, 250);
        });
    }

    /**
     * Set up error handling mechanisms
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            this.handleError('Global error', e.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled promise rejection', e.reason);
        });
    }

    /**
     * Set up performance optimizations
     */
    setupPerformanceOptimizations() {
        // Preload next and previous month data
        this.preloadAdjacentMonths();
        
        // Set up intersection observer for lazy loading if needed
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }
    }

    /**
     * Handle navigation to previous month
     */
    navigatePrevious() {
        if (this.isLoading) return;
        
        this.setLoading(true);
        
        if (this.calendarEngine.previousMonth()) {
            this.render();
        } else {
            this.showMessage('Cannot navigate before January 2026', 'warning');
        }
        
        this.setLoading(false);
    }

    /**
     * Handle navigation to next month
     */
    navigateNext() {
        if (this.isLoading) return;
        
        this.setLoading(true);
        
        if (this.calendarEngine.nextMonth()) {
            this.render();
        } else {
            this.showMessage('Cannot navigate after December 2026', 'warning');
        }
        
        this.setLoading(false);
    }

    /**
     * Handle window resize events
     */
    handleResize() {
        // Recalculate layout if needed
        const container = document.querySelector('.container');
        if (container) {
            // Force reflow for responsive grid
            container.style.display = 'none';
            container.offsetHeight; // Trigger reflow
            container.style.display = '';
        }
    }

    /**
     * Preload adjacent months for better performance
     */
    preloadAdjacentMonths() {
        try {
            const currentDate = this.calendarEngine.getCurrentDate();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            
            // Preload previous month
            if (currentMonth > 0 || currentYear > 2026) {
                const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                this.calendarEngine.generateMonthGrid(prevMonth, prevYear);
            }
            
            // Preload next month
            if (currentMonth < 11 || currentYear < 2026) {
                const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                this.calendarEngine.generateMonthGrid(nextMonth, nextYear);
            }
        } catch (error) {
            console.warn('Preloading failed:', error);
        }
    }

    /**
     * Set up lazy loading for performance
     */
    setupLazyLoading() {
        // This could be used for loading flower images or other content
        // For now, we'll just set up the observer
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load content when it becomes visible
                    this.loadVisibleContent(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    /**
     * Load content when it becomes visible
     */
    loadVisibleContent(element) {
        // Placeholder for lazy loading implementation
        console.log('Loading content for:', element);
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        // Update UI to show loading state
        if (this.prevButton && this.nextButton) {
            this.prevButton.disabled = loading;
            this.nextButton.disabled = loading;
            
            if (loading) {
                this.prevButton.style.opacity = '0.5';
                this.nextButton.style.opacity = '0.5';
            } else {
                this.prevButton.style.opacity = '1';
                this.nextButton.style.opacity = '1';
            }
        }
    }

    /**
     * Show loading complete message
     */
    showLoadingComplete() {
        console.log('Multilingual Calendar 2026 loaded successfully');
    }

    /**
     * Handle errors gracefully
     */
    handleError(message, error) {
        console.error(message, error);
        this.errorState = true;
        
        // Show user-friendly error message
        this.showMessage(`Something went wrong: ${message}`, 'error');
        
        // Try to recover if possible
        this.attemptRecovery();
    }

    /**
     * Show user messages
     */
    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('app-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'app-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        // Set message type styling
        const colors = {
            info: '#3498db',
            warning: '#f39c12',
            error: '#e74c3c',
            success: '#27ae60'
        };
        
        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.opacity = '0';
                setTimeout(() => {
                    if (messageEl && messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, 5000);
    }

    /**
     * Attempt to recover from errors
     */
    attemptRecovery() {
        try {
            // Reset to current month if navigation failed
            this.calendarEngine.navigateToMonth(new Date().getMonth(), 2026);
            this.render();
            this.errorState = false;
            this.showMessage('Recovered successfully', 'success');
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
        }
    }

    /**
     * Render the complete calendar
     */
    render() {
        try {
            if (this.errorState) {
                console.warn('Skipping render due to error state');
                return;
            }
            
            // Use requestAnimationFrame for smooth rendering
            requestAnimationFrame(() => {
                this.renderMonthDisplay();
                this.renderFlowerDisplay();
                this.renderCalendarGrid();
                this.renderDailyContent();
                this.updateNavigationState();
            });
        } catch (error) {
            this.handleError('Rendering failed', error);
        }
    }

    /**
     * Render month display with bilingual names
     */
    renderMonthDisplay() {
        try {
            const currentDate = this.calendarEngine.getCurrentDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();

            if (this.currentMonthEn) {
                this.currentMonthEn.textContent = 
                    `${this.calendarEngine.getMonthName(month, 'en')} ${year}`;
            }
            
            if (this.currentMonthCh) {
                this.currentMonthCh.textContent = 
                    `${this.calendarEngine.getMonthName(month, 'zh')} ${year}年`;
            }
        } catch (error) {
            console.error('Month display rendering failed:', error);
            // Fallback display
            if (this.currentMonthEn) {
                this.currentMonthEn.textContent = 'Calendar 2026';
            }
        }
    }

    /**
     * Render flower display for current month
     */
    renderFlowerDisplay() {
        try {
            const currentDate = this.calendarEngine.getCurrentDate();
            const month = currentDate.getMonth();
            const flower = this.flowerManager.getMonthlyFlower(month);

            if (!flower) {
                console.warn('No flower data found for month:', month);
                return;
            }

            // Display flower emoji as placeholder for actual images
            if (this.flowerImage) {
                this.flowerImage.textContent = flower.emoji || '🌸';
                
                // Apply seasonal theme
                const theme = this.flowerManager.applySeasonalTheme(month);
                if (theme) {
                    this.flowerImage.style.background = 
                        `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`;
                }
            }
            
            // Display flower names in all three languages with fallbacks
            if (this.flowerNamePt) {
                this.flowerNamePt.textContent = flower.portuguese || 'Flower';
            }
            if (this.flowerNameEn) {
                this.flowerNameEn.textContent = flower.english || 'Flower';
            }
            if (this.flowerNameCh) {
                this.flowerNameCh.textContent = flower.chinese || '花';
            }
        } catch (error) {
            console.error('Flower display rendering failed:', error);
            // Fallback display
            if (this.flowerImage) {
                this.flowerImage.textContent = '🌸';
            }
        }
    }

    /**
     * Render the calendar grid
     */
    renderCalendarGrid() {
        try {
            if (!this.calendarGrid) {
                throw new Error('Calendar grid element not found');
            }
            
            const currentDate = this.calendarEngine.getCurrentDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            
            // Clear existing grid with animation
            this.calendarGrid.style.opacity = '0.5';
            
            setTimeout(() => {
                this.calendarGrid.innerHTML = '';
                
                // Add day headers
                const dayNames = this.calendarEngine.getDayNames('en');
                dayNames.forEach(dayName => {
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'day-header';
                    dayHeader.textContent = dayName;
                    this.calendarGrid.appendChild(dayHeader);
                });
                
                // Generate and render calendar grid
                const monthGrid = this.calendarEngine.generateMonthGrid(month, year);
                
                monthGrid.forEach((dateInfo, index) => {
                    const dayCell = this.createDayCell(dateInfo);
                    
                    // Add staggered animation
                    dayCell.style.opacity = '0';
                    dayCell.style.transform = 'scale(0.8)';
                    
                    this.calendarGrid.appendChild(dayCell);
                    
                    // Animate in with delay
                    setTimeout(() => {
                        dayCell.style.transition = 'all 0.3s ease';
                        dayCell.style.opacity = '1';
                        dayCell.style.transform = 'scale(1)';
                    }, index * 20);
                });
                
                // Restore grid opacity
                this.calendarGrid.style.opacity = '1';
            }, 150);
            
        } catch (error) {
            console.error('Calendar grid rendering failed:', error);
            // Fallback: show error message in grid
            if (this.calendarGrid) {
                this.calendarGrid.innerHTML = '<div class="error-message">Calendar unavailable</div>';
            }
        }
    }

    /**
     * Create a day cell element
     * @param {Object} dateInfo - Date information object
     * @returns {HTMLElement} Day cell element
     */
    createDayCell(dateInfo) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        
        // Add appropriate classes
        if (!dateInfo.isCurrentMonth) {
            dayCell.classList.add('other-month');
        }
        
        if (dateInfo.isToday) {
            dayCell.classList.add('current-date');
        }
        
        if (dateInfo.isWeekend && dateInfo.isCurrentMonth) {
            dayCell.classList.add('weekend');
        }
        
        // Create day number element
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = dateInfo.day;
        dayCell.appendChild(dayNumber);
        
        // Add click event for current month days with error handling
        if (dateInfo.isCurrentMonth) {
            dayCell.addEventListener('click', (e) => {
                try {
                    e.preventDefault();
                    this.selectDate(dateInfo, dayCell);
                } catch (error) {
                    this.handleError('Date selection failed', error);
                }
            });
            
            // Add keyboard accessibility
            dayCell.setAttribute('tabindex', '0');
            dayCell.setAttribute('role', 'button');
            dayCell.setAttribute('aria-label', `Select ${dateInfo.day}`);
            
            dayCell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectDate(dateInfo, dayCell);
                }
            });
        }
        
        return dayCell;
    }

    /**
     * Handle date selection
     */
    selectDate(dateInfo, dayCell) {
        // Remove previous selection
        document.querySelectorAll('.day-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Add selection to clicked cell
        dayCell.classList.add('selected');
        
        // Update daily content
        this.updateDailyContent(dateInfo.date);
        
        console.log('Selected date:', dateInfo.date);
    }

    /**
     * Render daily content section
     */
    renderDailyContent() {
        try {
            if (!this.dailyContent) return;
            
            // Get current or selected date
            const currentDate = this.calendarEngine.getCurrentDate();
            this.updateDailyContent(currentDate);
        } catch (error) {
            console.error('Daily content rendering failed:', error);
        }
    }

    /**
     * Update daily content for selected date
     */
    updateDailyContent(date) {
        try {
            if (!date) return;
            
            // Generate sample content (in a real app, this would come from a data source)
            const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
            
            // Sample quote of the day
            const quotes = [
                "Every day is a new beginning.",
                "Learning never exhausts the mind.",
                "The best time to plant a tree was 20 years ago. The second best time is now.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
            ];
            
            // Sample fun facts
            const facts = [
                "Did you know that honey never spoils?",
                "A group of flamingos is called a 'flamboyance'.",
                "The shortest war in history lasted only 38-45 minutes.",
                "Bananas are berries, but strawberries aren't!"
            ];
            
            if (this.dailyQuote) {
                this.dailyQuote.innerHTML = `
                    <h4>Quote of the Day</h4>
                    <p>"${quotes[dayOfYear % quotes.length]}"</p>
                `;
            }
            
            if (this.dailyFact) {
                this.dailyFact.innerHTML = `
                    <h4>Fun Fact</h4>
                    <p>${facts[dayOfYear % facts.length]}</p>
                `;
            }
            
            if (this.dailyVocabulary) {
                this.dailyVocabulary.innerHTML = `
                    <h4>Vocabulary</h4>
                    <p><strong>Word:</strong> Serendipity</p>
                    <p><strong>Meaning:</strong> A pleasant surprise</p>
                `;
            }
        } catch (error) {
            console.error('Daily content update failed:', error);
        }
    }

    /**
     * Update navigation button states
     */
    updateNavigationState() {
        try {
            const currentDate = this.calendarEngine.getCurrentDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            
            // Update previous button state
            if (this.prevButton) {
                const canGoPrev = !(month === 0 && year === 2026);
                this.prevButton.disabled = !canGoPrev;
                this.prevButton.style.opacity = canGoPrev ? '1' : '0.5';
            }
            
            // Update next button state
            if (this.nextButton) {
                const canGoNext = !(month === 11 && year === 2026);
                this.nextButton.disabled = !canGoNext;
                this.nextButton.style.opacity = canGoNext ? '1' : '0.5';
            }
        } catch (error) {
            console.error('Navigation state update failed:', error);
        }
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // Initialize calendar with a small delay to show loading
    setTimeout(() => {
        try {
            new MultilingualCalendar2026();
            
            // Hide loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
        } catch (error) {
            console.error('Failed to initialize calendar:', error);
            
            // Hide loading overlay and show error
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
            
            // Show error message
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 20px;">
                    <div>
                        <h1 style="color: #e74c3c; margin-bottom: 20px;">Calendar Unavailable</h1>
                        <p style="color: #7f8c8d; margin-bottom: 20px;">We're sorry, but the calendar could not be loaded.</p>
                        <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }, 500);
});