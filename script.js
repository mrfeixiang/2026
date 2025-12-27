class BilingualCalendar2026 {
    constructor() {
        this.currentDate = new Date(2026, 0, 1);
        this.selectedDate = new Date();
        this.currentLanguage = 'en'; // 'en' or 'zh'
        this.showTranslation = false;
        
        this.monthNames = {
            en: ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'],
            zh: ['一月', '二月', '三月', '四月', '五月', '六月',
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
        };
        
        this.dayNames = {
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            zh: ['日', '一', '二', '三', '四', '五', '六']
        };
        
        this.init();
        this.loadData();
    }

    init() {
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.prevButton = document.getElementById('prevMonth');
        this.nextButton = document.getElementById('nextMonth');
        this.langToggle = document.getElementById('langToggle');
        this.pronounceBtn = document.getElementById('pronounceBtn');
        this.translateBtn = document.getElementById('translateBtn');
        
        this.prevButton.addEventListener('click', () => this.previousMonth());
        this.nextButton.addEventListener('click', () => this.nextMonth());
        this.langToggle.addEventListener('click', () => this.toggleLanguage());
        this.pronounceBtn.addEventListener('click', () => this.pronounceQuote());
        this.translateBtn.addEventListener('click', () => this.toggleTranslation());
        
        this.renderCalendar();
        this.updateSidebar();
    }

    loadData() {
        // Monthly flowers with Chinese ink painting style
        this.monthlyFlowers = {
            0: { // January
                en: 'Plum Blossom',
                zh: '梅花',
                svg: this.createPlumBlossomSVG(),
                description: 'Symbol of perseverance and hope in winter'
            },
            1: { // February
                en: 'Camellia',
                zh: '山茶花',
                svg: this.createCamelliaSVG(),
                description: 'Represents love and devotion'
            },
            2: { // March
                en: 'Peach Blossom',
                zh: '桃花',
                svg: this.createPeachBlossomSVG(),
                description: 'Symbol of spring and renewal'
            },
            3: { // April
                en: 'Cherry Blossom',
                zh: '樱花',
                svg: this.createCherryBlossomSVG(),
                description: 'Beauty and the fleeting nature of life'
            },
            4: { // May
                en: 'Peony',
                zh: '牡丹',
                svg: this.createPeonySVG(),
                description: 'King of flowers, symbol of honor and wealth'
            },
            5: { // June
                en: 'Lotus',
                zh: '荷花',
                svg: this.createLotusSVG(),
                description: 'Purity and enlightenment'
            },
            6: { // July
                en: 'Morning Glory',
                zh: '牵牛花',
                svg: this.createMorningGlorySVG(),
                description: 'Love and affection'
            },
            7: { // August
                en: 'Osmanthus',
                zh: '桂花',
                svg: this.createOsmanthusSVG(),
                description: 'Fragrance and nobility'
            },
            8: { // September
                en: 'Chrysanthemum',
                zh: '菊花',
                svg: this.createChrysanthemumSVG(),
                description: 'Longevity and joy'
            },
            9: { // October
                en: 'Hibiscus',
                zh: '木槿花',
                svg: this.createHibiscusSVG(),
                description: 'Delicate beauty'
            },
            10: { // November
                en: 'Narcissus',
                zh: '水仙花',
                svg: this.createNarcissusSVG(),
                description: 'Good fortune and prosperity'
            },
            11: { // December
                en: 'Winter Jasmine',
                zh: '迎春花',
                svg: this.createWinterJasmineSVG(),
                description: 'Hope and optimism'
            }
        };
        // Bilingual science events
        this.scienceEvents = {
            '1/1': {
                en: 'New Year - Reflecting on scientific progress',
                zh: '新年 - 反思科学进步'
            },
            '1/15': {
                en: '1929 - Martin Luther King Jr. born, advocate for science education equality',
                zh: '1929年 - 马丁·路德·金出生，倡导科学教育平等'
            },
            '2/11': {
                en: '1847 - Thomas Edison born, inventor of the light bulb',
                zh: '1847年 - 托马斯·爱迪生出生，电灯泡发明者'
            },
            '2/12': {
                en: '1809 - Charles Darwin born, theory of evolution',
                zh: '1809年 - 查尔斯·达尔文出生，进化论创立者'
            },
            '2/19': {
                en: '1473 - Nicolaus Copernicus born, heliocentric model',
                zh: '1473年 - 尼古拉·哥白尼出生，日心说创立者'
            },
            '3/14': {
                en: '1879 - Albert Einstein born, theory of relativity',
                zh: '1879年 - 阿尔伯特·爱因斯坦出生，相对论创立者'
            },
            '3/31': {
                en: '1596 - René Descartes born, scientific method',
                zh: '1596年 - 勒内·笛卡尔出生，科学方法论创立者'
            },
            '4/16': {
                en: '1867 - Wilbur Wright born, aviation pioneer',
                zh: '1867年 - 威尔伯·莱特出生，航空先驱'
            },
            '4/22': {
                en: 'Earth Day - Environmental science awareness',
                zh: '地球日 - 环境科学意识日'
            },
            '5/8': {
                en: '1794 - Antoine Lavoisier executed, father of modern chemistry',
                zh: '1794年 - 安托万·拉瓦锡被处决，现代化学之父'
            },
            '6/23': {
                en: '1912 - Alan Turing born, computer science pioneer',
                zh: '1912年 - 阿兰·图灵出生，计算机科学先驱'
            },
            '7/10': {
                en: '1856 - Nikola Tesla born, electrical engineering genius',
                zh: '1856年 - 尼古拉·特斯拉出生，电气工程天才'
            },
            '8/19': {
                en: '1662 - Blaise Pascal died, mathematics and physics',
                zh: '1662年 - 布莱兹·帕斯卡逝世，数学和物理学家'
            },
            '9/23': {
                en: '1846 - Neptune discovered by Johann Galle',
                zh: '1846年 - 约翰·加勒发现海王星'
            },
            '10/21': {
                en: '1833 - Alfred Nobel born, inventor of dynamite',
                zh: '1833年 - 阿尔弗雷德·诺贝尔出生，炸药发明者'
            },
            '11/8': {
                en: '1895 - Wilhelm Röntgen discovered X-rays',
                zh: '1895年 - 威廉·伦琴发现X射线'
            },
            '12/25': {
                en: '1642 - Isaac Newton born, laws of motion and gravity',
                zh: '1642年 - 艾萨克·牛顿出生，运动定律和万有引力定律创立者'
            }
        };

        // Bilingual historical books
        this.historicalBooks = [
            { 
                year: 1859, 
                title: { en: 'On the Origin of Species', zh: '物种起源' }, 
                author: { en: 'Charles Darwin', zh: '查尔斯·达尔文' }
            },
            { 
                year: 1687, 
                title: { en: 'Principia Mathematica', zh: '自然哲学的数学原理' }, 
                author: { en: 'Isaac Newton', zh: '艾萨克·牛顿' }
            },
            { 
                year: 1543, 
                title: { en: 'De Revolutionibus', zh: '天体运行论' }, 
                author: { en: 'Nicolaus Copernicus', zh: '尼古拉·哥白尼' }
            },
            { 
                year: 1628, 
                title: { en: 'De Motu Cordis', zh: '心血运动论' }, 
                author: { en: 'William Harvey', zh: '威廉·哈维' }
            },
            { 
                year: 1665, 
                title: { en: 'Micrographia', zh: '显微图谱' }, 
                author: { en: 'Robert Hooke', zh: '罗伯特·胡克' }
            },
            { 
                year: 1953, 
                title: { en: 'The Double Helix', zh: '双螺旋' }, 
                author: { en: 'James Watson', zh: '詹姆斯·沃森' }
            },
            { 
                year: 1962, 
                title: { en: 'Silent Spring', zh: '寂静的春天' }, 
                author: { en: 'Rachel Carson', zh: '蕾切尔·卡森' }
            },
            { 
                year: 1988, 
                title: { en: 'A Brief History of Time', zh: '时间简史' }, 
                author: { en: 'Stephen Hawking', zh: '史蒂芬·霍金' }
            }
        ];

        // Bilingual quotes
        this.quotes = [
            { 
                text: { 
                    en: 'The important thing is not to stop questioning.', 
                    zh: '重要的是永远不要停止质疑。' 
                }, 
                author: { en: 'Albert Einstein', zh: '阿尔伯特·爱因斯坦' }
            },
            { 
                text: { 
                    en: 'Science is a way of thinking much more than it is a body of knowledge.', 
                    zh: '科学更多的是一种思维方式，而不仅仅是知识体系。' 
                }, 
                author: { en: 'Carl Sagan', zh: '卡尔·萨根' }
            },
            { 
                text: { 
                    en: 'In science, there is only physics; all the rest is stamp collecting.', 
                    zh: '在科学中，只有物理学；其余的都是集邮。' 
                }, 
                author: { en: 'Ernest Rutherford', zh: '欧内斯特·卢瑟福' }
            },
            { 
                text: { 
                    en: 'The good thing about science is that it\'s true whether or not you believe in it.', 
                    zh: '科学的好处在于，无论你是否相信它，它都是真实的。' 
                }, 
                author: { en: 'Neil deGrasse Tyson', zh: '尼尔·德格拉斯·泰森' }
            },
            { 
                text: { 
                    en: 'Research is what I\'m doing when I don\'t know what I\'m doing.', 
                    zh: '研究就是当我不知道自己在做什么时所做的事情。' 
                }, 
                author: { en: 'Wernher von Braun', zh: '沃纳·冯·布劳恩' }
            },
            { 
                text: { 
                    en: 'Science knows no country, because knowledge belongs to humanity.', 
                    zh: '科学无国界，因为知识属于全人类。' 
                }, 
                author: { en: 'Louis Pasteur', zh: '路易·巴斯德' }
            },
            { 
                text: { 
                    en: 'Nothing in life is to be feared, it is only to be understood.', 
                    zh: '生活中没有什么可怕的，只有需要理解的。' 
                }, 
                author: { en: 'Marie Curie', zh: '玛丽·居里' }
            },
            { 
                text: { 
                    en: 'If I have seen further it is by standing on the shoulders of Giants.', 
                    zh: '如果我看得更远，那是因为我站在巨人的肩膀上。' 
                }, 
                author: { en: 'Isaac Newton', zh: '艾萨克·牛顿' }
            }
        ];

        // Daily vocabulary for English learning
        this.dailyVocabulary = [
            { word: 'hypothesis', pronunciation: '/haɪˈpɒθəsɪs/', meaning: 'A proposed explanation for a phenomenon', chinese: '假设，假说' },
            { word: 'experiment', pronunciation: '/ɪkˈsperɪmənt/', meaning: 'A scientific procedure to test a hypothesis', chinese: '实验' },
            { word: 'observation', pronunciation: '/ˌɒbzəˈveɪʃən/', meaning: 'The action of watching something carefully', chinese: '观察' },
            { word: 'theory', pronunciation: '/ˈθɪəri/', meaning: 'A well-substantiated explanation of natural phenomena', chinese: '理论' },
            { word: 'discovery', pronunciation: '/dɪˈskʌvəri/', meaning: 'The finding of something new or previously unknown', chinese: '发现' },
            { word: 'innovation', pronunciation: '/ˌɪnəˈveɪʃən/', meaning: 'A new method, idea, or product', chinese: '创新' },
            { word: 'research', pronunciation: '/rɪˈsɜːtʃ/', meaning: 'Systematic investigation to establish facts', chinese: '研究' },
            { word: 'analysis', pronunciation: '/əˈnæləsɪs/', meaning: 'Detailed examination of elements or structure', chinese: '分析' },
            { word: 'evidence', pronunciation: '/ˈevɪdəns/', meaning: 'Facts or information supporting a belief or proposition', chinese: '证据' },
            { word: 'conclusion', pronunciation: '/kənˈkluːʒən/', meaning: 'A judgment reached by reasoning', chinese: '结论' }
        ];
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'zh' : 'en';
        this.updateLanguageDisplay();
        this.renderCalendar();
        this.updateSidebar();
    }

    updateLanguageDisplay() {
        const elements = {
            mainTitle: document.getElementById('mainTitle'),
            mainTitleCh: document.getElementById('mainTitleCh'),
            subtitle: document.getElementById('subtitle'),
            subtitleCh: document.getElementById('subtitleCh'),
            quoteTitle: document.getElementById('quoteTitle'),
            quoteTitleCh: document.getElementById('quoteTitleCh'),
            scienceTitle: document.getElementById('scienceTitle'),
            scienceTitleCh: document.getElementById('scienceTitleCh'),
            booksTitle: document.getElementById('booksTitle'),
            booksTitleCh: document.getElementById('booksTitleCh'),
            vocabTitle: document.getElementById('vocabTitle'),
            vocabTitleCh: document.getElementById('vocabTitleCh')
        };

        if (this.currentLanguage === 'zh') {
            elements.mainTitle.classList.add('hidden');
            elements.mainTitleCh.classList.remove('hidden');
            elements.subtitle.classList.add('hidden');
            elements.subtitleCh.classList.remove('hidden');
            elements.quoteTitle.classList.add('hidden');
            elements.quoteTitleCh.classList.remove('hidden');
            elements.scienceTitle.classList.add('hidden');
            elements.scienceTitleCh.classList.remove('hidden');
            elements.booksTitle.classList.add('hidden');
            elements.booksTitleCh.classList.remove('hidden');
            elements.vocabTitle.classList.add('hidden');
            elements.vocabTitleCh.classList.remove('hidden');
            this.langToggle.textContent = 'English';
        } else {
            elements.mainTitle.classList.remove('hidden');
            elements.mainTitleCh.classList.add('hidden');
            elements.subtitle.classList.remove('hidden');
            elements.subtitleCh.classList.add('hidden');
            elements.quoteTitle.classList.remove('hidden');
            elements.quoteTitleCh.classList.add('hidden');
            elements.scienceTitle.classList.remove('hidden');
            elements.scienceTitleCh.classList.add('hidden');
            elements.booksTitle.classList.remove('hidden');
            elements.booksTitleCh.classList.add('hidden');
            elements.vocabTitle.classList.remove('hidden');
            elements.vocabTitleCh.classList.add('hidden');
            this.langToggle.textContent = '中文';
        }
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        this.currentMonthElement.textContent = 
            `${this.monthNames[this.currentLanguage][month]} ${year}`;
        
        // Update monthly flower
        this.updateMonthlyFlower(month);
        
        this.calendarGrid.innerHTML = '';
        
        // Add day headers
        this.dayNames[this.currentLanguage].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            this.calendarGrid.appendChild(dayHeader);
        });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayCell = this.createDayCell(daysInPrevMonth - i, true);
            this.calendarGrid.appendChild(dayCell);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createDayCell(day, false);
            this.calendarGrid.appendChild(dayCell);
        }
        
        // Add next month's leading days
        const totalCells = this.calendarGrid.children.length - 7;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = this.createDayCell(day, true);
            this.calendarGrid.appendChild(dayCell);
        }
    }

    updateMonthlyFlower(month) {
        const flower = this.monthlyFlowers[month];
        const flowerArt = document.getElementById('flowerArt');
        const flowerName = document.getElementById('flowerName');
        const flowerNameChinese = document.getElementById('flowerNameChinese');
        
        // Create SVG as background
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(flower.svg)}`;
        flowerArt.style.backgroundImage = `url("${svgDataUrl}")`;
        
        if (this.currentLanguage === 'zh') {
            flowerName.textContent = flower.zh;
            flowerNameChinese.textContent = flower.en;
        } else {
            flowerName.textContent = flower.en;
            flowerNameChinese.textContent = flower.zh;
        }
    }

    createDayCell(day, isOtherMonth) {
        const dayCell = document.createElement('div');
        dayCell.className = `day-cell ${isOtherMonth ? 'other-month' : ''}`;
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        if (!isOtherMonth) {
            const month = this.currentDate.getMonth() + 1;
            const dateKey = `${month}/${day}`;
            
            if (this.scienceEvents[dateKey]) {
                const indicator = document.createElement('div');
                indicator.className = 'day-indicator science-indicator';
                dayCell.appendChild(indicator);
            }
            
            const quoteIndicator = document.createElement('div');
            quoteIndicator.className = 'day-indicator quote-indicator';
            dayCell.appendChild(quoteIndicator);
            
            dayCell.addEventListener('click', () => {
                document.querySelectorAll('.day-cell').forEach(cell => 
                    cell.classList.remove('selected'));
                dayCell.classList.add('selected');
                this.selectedDate = new Date(this.currentDate.getFullYear(), 
                    this.currentDate.getMonth(), day);
                this.updateSidebar();
            });
        }
        
        return dayCell;
    }

    updateSidebar() {
        this.updateDailyQuote();
        this.updateScienceEvents();
        this.updateBookPublications();
        this.updateVocabulary();
    }

    updateDailyQuote() {
        const dayOfYear = this.getDayOfYear(this.selectedDate);
        const quoteIndex = dayOfYear % this.quotes.length;
        const quote = this.quotes[quoteIndex];
        
        const quoteTextEn = document.getElementById('quoteText');
        const quoteTextCh = document.getElementById('quoteTextCh');
        const quoteAuthorEn = document.getElementById('quoteAuthor');
        const quoteAuthorCh = document.getElementById('quoteAuthorCh');
        
        quoteTextEn.textContent = quote.text.en;
        quoteTextCh.textContent = quote.text.zh;
        quoteAuthorEn.textContent = `— ${quote.author.en}`;
        quoteAuthorCh.textContent = `— ${quote.author.zh}`;
        
        if (this.currentLanguage === 'zh' || this.showTranslation) {
            quoteTextCh.classList.remove('hidden');
            quoteAuthorCh.classList.remove('hidden');
        } else {
            quoteTextCh.classList.add('hidden');
            quoteAuthorCh.classList.add('hidden');
        }
    }

    updateScienceEvents() {
        const month = this.selectedDate.getMonth() + 1;
        const day = this.selectedDate.getDate();
        const dateKey = `${month}/${day}`;
        
        const eventsContainer = document.getElementById('scienceEvents');
        const eventsContainerCh = document.getElementById('scienceEventsCh');
        
        eventsContainer.innerHTML = '';
        eventsContainerCh.innerHTML = '';
        
        if (this.scienceEvents[dateKey]) {
            const event = this.scienceEvents[dateKey];
            
            const eventItemEn = document.createElement('div');
            eventItemEn.className = 'event-item';
            eventItemEn.innerHTML = `
                <div class="event-date">${this.monthNames.en[month-1]} ${day}</div>
                <div class="event-description">${event.en}</div>
            `;
            eventsContainer.appendChild(eventItemEn);
            
            const eventItemCh = document.createElement('div');
            eventItemCh.className = 'event-item';
            eventItemCh.innerHTML = `
                <div class="event-date">${this.monthNames.zh[month-1]} ${day}日</div>
                <div class="event-description">${event.zh}</div>
            `;
            eventsContainerCh.appendChild(eventItemCh);
        } else {
            const noEventsEn = this.currentLanguage === 'en' ? 
                'No major science events recorded for this day.' : '';
            const noEventsCh = this.currentLanguage === 'zh' ? 
                '今天没有记录重大科学事件。' : '';
            
            eventsContainer.innerHTML = `<p>${noEventsEn}</p>`;
            eventsContainerCh.innerHTML = `<p>${noEventsCh}</p>`;
        }
        
        if (this.currentLanguage === 'zh') {
            eventsContainer.classList.add('hidden');
            eventsContainerCh.classList.remove('hidden');
        } else {
            eventsContainer.classList.remove('hidden');
            eventsContainerCh.classList.add('hidden');
        }
    }

    updateBookPublications() {
        const booksContainer = document.getElementById('booksThisYear');
        const booksContainerCh = document.getElementById('booksThisYearCh');
        
        booksContainer.innerHTML = '';
        booksContainerCh.innerHTML = '';
        
        const selectedBooks = this.historicalBooks.slice(0, 3);
        
        selectedBooks.forEach(book => {
            const bookItemEn = document.createElement('div');
            bookItemEn.className = 'book-item';
            bookItemEn.innerHTML = `
                <div class="book-year">${book.year}</div>
                <div class="book-title">${book.title.en}</div>
                <div class="book-author">by ${book.author.en}</div>
            `;
            booksContainer.appendChild(bookItemEn);
            
            const bookItemCh = document.createElement('div');
            bookItemCh.className = 'book-item';
            bookItemCh.innerHTML = `
                <div class="book-year">${book.year}年</div>
                <div class="book-title">${book.title.zh}</div>
                <div class="book-author">作者：${book.author.zh}</div>
            `;
            booksContainerCh.appendChild(bookItemCh);
        });
        
        if (this.currentLanguage === 'zh') {
            booksContainer.classList.add('hidden');
            booksContainerCh.classList.remove('hidden');
        } else {
            booksContainer.classList.remove('hidden');
            booksContainerCh.classList.add('hidden');
        }
    }

    updateVocabulary() {
        const dayOfYear = this.getDayOfYear(this.selectedDate);
        const vocabIndex = dayOfYear % this.dailyVocabulary.length;
        const vocab = this.dailyVocabulary[vocabIndex];
        
        const vocabularyList = document.getElementById('vocabularyList');
        vocabularyList.innerHTML = '';
        
        const vocabItem = document.createElement('div');
        vocabItem.className = 'vocab-item';
        vocabItem.innerHTML = `
            <div class="vocab-word">${vocab.word}</div>
            <div class="vocab-pronunciation">${vocab.pronunciation}</div>
            <div class="vocab-meaning">${vocab.meaning}</div>
            <div class="vocab-chinese">${vocab.chinese}</div>
        `;
        
        vocabItem.addEventListener('click', () => {
            this.pronounceWord(vocab.word);
        });
        
        vocabularyList.appendChild(vocabItem);
    }

    pronounceQuote() {
        const dayOfYear = this.getDayOfYear(this.selectedDate);
        const quoteIndex = dayOfYear % this.quotes.length;
        const quote = this.quotes[quoteIndex];
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(quote.text.en);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    pronounceWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        }
    }

    toggleTranslation() {
        this.showTranslation = !this.showTranslation;
        this.translateBtn.textContent = this.showTranslation ? 
            '🔒 Hide Translation' : '📖 Show Translation';
        this.updateDailyQuote();
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }
}

// Initialize the bilingual calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BilingualCalendar2026();
});

    // Chinese ink painting style SVG creators
    createPlumBlossomSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="plumGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffb3ba;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff7f7f;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <g stroke="#8B4513" stroke-width="3" fill="none" opacity="0.8">
                <path d="M20 150 Q60 120 100 100 Q140 80 180 70" stroke-width="4"/>
                <path d="M50 140 Q70 110 90 100" stroke-width="2"/>
                <path d="M120 90 Q140 70 160 80" stroke-width="2"/>
            </g>
            <g fill="url(#plumGrad)" stroke="#d63384" stroke-width="1">
                <circle cx="70" cy="120" r="8" opacity="0.9"/>
                <circle cx="90" cy="105" r="6" opacity="0.8"/>
                <circle cx="130" cy="85" r="7" opacity="0.9"/>
                <circle cx="150" cy="75" r="5" opacity="0.7"/>
                <circle cx="45" cy="135" r="6" opacity="0.8"/>
            </g>
            <g stroke="#2d5016" stroke-width="1" fill="none" opacity="0.6">
                <path d="M65 115 L75 110 M85 100 L95 95 M125 80 L135 75"/>
            </g>
        </svg>`;
    }

    createCamelliaSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="camelliaGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#c44569;stop-opacity:0.7" />
                </radialGradient>
            </defs>
            <g fill="url(#camelliaGrad)" stroke="#8B0000" stroke-width="1" opacity="0.8">
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(0 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(45 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(90 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(135 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(22.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(67.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(112.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(157.5 100 100)"/>
            </g>
            <circle cx="100" cy="100" r="8" fill="#FFD700" opacity="0.8"/>
            <g stroke="#228B22" stroke-width="2" fill="none" opacity="0.7">
                <path d="M100 130 Q90 150 80 170"/>
                <path d="M100 130 Q110 150 120 170"/>
                <ellipse cx="75" cy="160" rx="8" ry="15" fill="#90EE90" opacity="0.6"/>
                <ellipse cx="125" cy="160" rx="8" ry="15" fill="#90EE90" opacity="0.6"/>
            </g>
        </svg>`;
    }

    createPeachBlossomSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="peachGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffb3d9;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#ff80bf;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <g stroke="#8B4513" stroke-width="2" fill="none" opacity="0.8">
                <path d="M30 170 Q80 140 130 120 Q160 110 180 100"/>
                <path d="M60 160 Q80 130 100 120"/>
                <path d="M140 115 Q160 100 170 90"/>
            </g>
            <g fill="url(#peachGrad)" stroke="#ff1493" stroke-width="0.5">
                <path d="M80 140 Q75 135 70 140 Q75 145 80 140 Q85 135 90 140 Q85 145 80 140" opacity="0.8"/>
                <path d="M110 125 Q105 120 100 125 Q105 130 110 125 Q115 120 120 125 Q115 130 110 125" opacity="0.9"/>
                <path d="M150 105 Q145 100 140 105 Q145 110 150 105 Q155 100 160 105 Q155 110 150 105" opacity="0.8"/>
                <path d="M50 155 Q45 150 40 155 Q45 160 50 155 Q55 150 60 155 Q55 160 50 155" opacity="0.7"/>
            </g>
            <g stroke="#FFD700" stroke-width="1" fill="#FFD700" opacity="0.6">
                <circle cx="80" cy="140" r="2"/>
                <circle cx="110" cy="125" r="2"/>
                <circle cx="150" cy="105" r="2"/>
                <circle cx="50" cy="155" r="2"/>
            </g>
        </svg>`;
    }

    createCherryBlossomSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="cherryGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffb3d9;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ff99cc;stop-opacity:0.5" />
                </radialGradient>
            </defs>
            <g stroke="#654321" stroke-width="3" fill="none" opacity="0.8">
                <path d="M40 180 Q70 150 100 130 Q130 110 160 90"/>
                <path d="M70 170 Q90 140 110 125"/>
                <path d="M130 115 Q150 95 170 85"/>
            </g>
            <g fill="url(#cherryGrad)" stroke="#ff69b4" stroke-width="0.5">
                <g transform="translate(90,140)">
                    <path d="M0,-8 Q-6,-3 -8,3 Q-3,6 3,8 Q6,3 8,-3 Q3,-6 -3,-8 Q-6,-3 0,-8" opacity="0.9"/>
                </g>
                <g transform="translate(120,120)">
                    <path d="M0,-6 Q-4,-2 -6,2 Q-2,4 2,6 Q4,2 6,-2 Q2,-4 -2,-6 Q-4,-2 0,-6" opacity="0.8"/>
                </g>
                <g transform="translate(150,95)">
                    <path d="M0,-7 Q-5,-2 -7,3 Q-2,5 3,7 Q5,2 7,-3 Q2,-5 -3,-7 Q-5,-2 0,-7" opacity="0.9"/>
                </g>
                <g transform="translate(60,160)">
                    <path d="M0,-5 Q-3,-1 -5,2 Q-1,3 2,5 Q3,1 5,-2 Q1,-3 -2,-5 Q-3,-1 0,-5" opacity="0.7"/>
                </g>
            </g>
            <g fill="#FFD700" opacity="0.7">
                <circle cx="90" cy="140" r="1.5"/>
                <circle cx="120" cy="120" r="1.5"/>
                <circle cx="150" cy="95" r="1.5"/>
                <circle cx="60" cy="160" r="1.5"/>
            </g>
        </svg>`;
    }

    createPeonySVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="peonyGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#c44569;stop-opacity:0.7" />
                </radialGradient>
            </defs>
            <g fill="url(#peonyGrad)" stroke="#8B0000" stroke-width="1" opacity="0.8">
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(0 100 100)"/>
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(30 100 100)"/>
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(60 100 100)"/>
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(90 100 100)"/>
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(120 100 100)"/>
                <ellipse cx="100" cy="100" rx="35" ry="20" transform="rotate(150 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(15 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(45 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(75 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(105 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(135 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(165 100 100)"/>
            </g>
            <circle cx="100" cy="100" r="12" fill="#FFD700" opacity="0.8"/>
            <g stroke="#228B22" stroke-width="3" fill="none" opacity="0.7">
                <path d="M100 140 Q85 160 70 180"/>
                <path d="M100 140 Q115 160 130 180"/>
                <ellipse cx="65" cy="170" rx="12" ry="20" fill="#90EE90" opacity="0.6"/>
                <ellipse cx="135" cy="170" rx="12" ry="20" fill="#90EE90" opacity="0.6"/>
            </g>
        </svg>`;
    }

    createLotusSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="lotusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffb3d9;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#ff80bf;stop-opacity:0.6" />
                </radialGradient>
                <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#90EE90;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#228B22;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <ellipse cx="60" cy="150" rx="25" ry="15" fill="url(#leafGrad)" opacity="0.7"/>
            <ellipse cx="140" cy="160" rx="30" ry="18" fill="url(#leafGrad)" opacity="0.6"/>
            <g fill="url(#lotusGrad)" stroke="#ff1493" stroke-width="1" opacity="0.8">
                <ellipse cx="100" cy="100" rx="30" ry="18" transform="rotate(0 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="18" transform="rotate(45 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="18" transform="rotate(90 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="18" transform="rotate(135 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(22.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(67.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(112.5 100 100)"/>
                <ellipse cx="100" cy="100" rx="25" ry="15" transform="rotate(157.5 100 100)"/>
            </g>
            <circle cx="100" cy="100" r="10" fill="#FFD700" opacity="0.8"/>
            <g stroke="#4169E1" stroke-width="2" fill="none" opacity="0.5">
                <path d="M100 180 Q100 140 100 120"/>
                <circle cx="100" cy="180" r="3" fill="#4169E1" opacity="0.6"/>
            </g>
        </svg>`;
    }

    createMorningGlorySVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="morningGloryGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#9370DB;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#4B0082;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <g stroke="#228B22" stroke-width="2" fill="none" opacity="0.7">
                <path d="M20 180 Q40 160 60 140 Q80 120 100 100 Q120 80 140 70"/>
                <path d="M50 170 Q70 150 90 130"/>
                <path d="M110 110 Q130 90 150 80"/>
            </g>
            <g fill="url(#morningGloryGrad)" stroke="#4B0082" stroke-width="1">
                <circle cx="80" cy="130" r="15" opacity="0.8"/>
                <circle cx="110" cy="105" r="12" opacity="0.9"/>
                <circle cx="140" cy="85" r="10" opacity="0.8"/>
                <path d="M80 130 Q75 125 70 130 Q75 135 80 130 Q85 125 90 130 Q85 135 80 130" opacity="0.7"/>
                <path d="M110 105 Q105 100 100 105 Q105 110 110 105 Q115 100 120 105 Q115 110 110 105" opacity="0.8"/>
            </g>
            <g fill="#FFD700" opacity="0.7">
                <circle cx="80" cy="130" r="2"/>
                <circle cx="110" cy="105" r="2"/>
                <circle cx="140" cy="85" r="2"/>
            </g>
            <g stroke="#228B22" stroke-width="1" fill="#90EE90" opacity="0.6">
                <ellipse cx="65" cy="145" rx="6" ry="10"/>
                <ellipse cx="95" cy="120" rx="5" ry="8"/>
                <ellipse cx="125" cy="95" rx="4" ry="7"/>
            </g>
        </svg>`;
    }

    createOsmanthusSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="osmanthusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.7" />
                </radialGradient>
            </defs>
            <g stroke="#8B4513" stroke-width="3" fill="none" opacity="0.8">
                <path d="M50 180 Q80 150 110 130 Q140 110 170 90"/>
                <path d="M70 170 Q90 140 110 125"/>
                <path d="M130 120 Q150 100 170 85"/>
            </g>
            <g fill="url(#osmanthusGrad)" stroke="#FF8C00" stroke-width="0.5">
                <circle cx="85" cy="145" r="3" opacity="0.9"/>
                <circle cx="90" cy="140" r="2" opacity="0.8"/>
                <circle cx="95" cy="148" r="2.5" opacity="0.9"/>
                <circle cx="115" cy="125" r="3" opacity="0.8"/>
                <circle cx="120" cy="120" r="2" opacity="0.9"/>
                <circle cx="125" cy="128" r="2.5" opacity="0.8"/>
                <circle cx="145" cy="105" r="3" opacity="0.9"/>
                <circle cx="150" cy="100" r="2" opacity="0.8"/>
                <circle cx="155" cy="108" r="2.5" opacity="0.9"/>
            </g>
            <g stroke="#228B22" stroke-width="1" fill="#90EE90" opacity="0.6">
                <ellipse cx="75" cy="155" rx="8" ry="12"/>
                <ellipse cx="105" cy="135" rx="7" ry="10"/>
                <ellipse cx="135" cy="115" rx="6" ry="9"/>
                <ellipse cx="165" cy="95" rx="5" ry="8"/>
            </g>
        </svg>`;
    }

    createChrysanthemumSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="chrysGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <g fill="url(#chrysGrad)" stroke="#FF8C00" stroke-width="0.5" opacity="0.8">
                <g transform="translate(100,100)">
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(0)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(15)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(30)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(45)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(60)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(75)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(90)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(105)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(120)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(135)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(150)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(165)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(180)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(195)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(210)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(225)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(240)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(255)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(270)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(285)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(300)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(315)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(330)"/>
                    <path d="M0,-25 Q-3,-20 0,-15 Q3,-20 0,-25" transform="rotate(345)"/>
                </g>
            </g>
            <circle cx="100" cy="100" r="8" fill="#8B4513" opacity="0.8"/>
            <g stroke="#228B22" stroke-width="2" fill="none" opacity="0.7">
                <path d="M100 130 Q90 150 80 170"/>
                <path d="M100 130 Q110 150 120 170"/>
                <ellipse cx="75" cy="160" rx="8" ry="15" fill="#90EE90" opacity="0.6"/>
                <ellipse cx="125" cy="160" rx="8" ry="15" fill="#90EE90" opacity="0.6"/>
            </g>
        </svg>`;
    }

    createHibiscusSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="hibiscusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#FF6347;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#DC143C;stop-opacity:0.6" />
                </radialGradient>
            </defs>
            <g fill="url(#hibiscusGrad)" stroke="#8B0000" stroke-width="1" opacity="0.8">
                <ellipse cx="100" cy="100" rx="30" ry="20" transform="rotate(0 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="20" transform="rotate(72 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="20" transform="rotate(144 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="20" transform="rotate(216 100 100)"/>
                <ellipse cx="100" cy="100" rx="30" ry="20" transform="rotate(288 100 100)"/>
            </g>
            <g stroke="#FFD700" stroke-width="2" fill="none" opacity="0.8">
                <path d="M100 100 L100 80"/>
                <circle cx="100" cy="75" r="3" fill="#FFD700"/>
                <circle cx="98" cy="78" r="1" fill="#FF4500"/>
                <circle cx="102" cy="78" r="1" fill="#FF4500"/>
            </g>
            <circle cx="100" cy="100" r="8" fill="#8B0000" opacity="0.6"/>
            <g stroke="#228B22" stroke-width="2" fill="none" opacity="0.7">
                <path d="M100 130 Q85 150 70 170"/>
                <path d="M100 130 Q115 150 130 170"/>
                <ellipse cx="65" cy="160" rx="10" ry="18" fill="#90EE90" opacity="0.6"/>
                <ellipse cx="135" cy="160" rx="10" ry="18" fill="#90EE90" opacity="0.6"/>
            </g>
        </svg>`;
    }

    createNarcissusSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="narcissusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#FFFACD;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#F0E68C;stop-opacity:0.7" />
                </radialGradient>
            </defs>
            <g fill="url(#narcissusGrad)" stroke="#DAA520" stroke-width="1" opacity="0.8">
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(0 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(60 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(120 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(180 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(240 100 100)"/>
                <ellipse cx="100" cy="100" rx="20" ry="12" transform="rotate(300 100 100)"/>
            </g>
            <circle cx="100" cy="100" r="8" fill="#FFD700" stroke="#FF8C00" stroke-width="1" opacity="0.9"/>
            <g stroke="#228B22" stroke-width="3" fill="none" opacity="0.7">
                <path d="M100 130 Q100 150 100 170"/>
                <path d="M100 170 Q90 175 80 180"/>
                <path d="M100 170 Q110 175 120 180"/>
            </g>
            <g stroke="#228B22" stroke-width="1" fill="#90EE90" opacity="0.6">
                <ellipse cx="85" cy="175" rx="4" ry="12"/>
                <ellipse cx="115" cy="175" rx="4" ry="12"/>
            </g>
        </svg>`;
    }

    createWinterJasmineSVG() {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="jasmineGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#FFFF99;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0.7" />
                </radialGradient>
            </defs>
            <g stroke="#8B4513" stroke-width="2" fill="none" opacity="0.8">
                <path d="M30 170 Q60 140 90 120 Q120 100 150 80"/>
                <path d="M50 160 Q70 130 90 115"/>
                <path d="M110 110 Q130 90 150 75"/>
            </g>
            <g fill="url(#jasmineGrad)" stroke="#DAA520" stroke-width="0.5">
                <g transform="translate(70,135)">
                    <ellipse rx="4" ry="8" transform="rotate(0)"/>
                    <ellipse rx="4" ry="8" transform="rotate(60)"/>
                    <ellipse rx="4" ry="8" transform="rotate(120)"/>
                    <ellipse rx="4" ry="8" transform="rotate(180)"/>
                    <ellipse rx="4" ry="8" transform="rotate(240)"/>
                    <ellipse rx="4" ry="8" transform="rotate(300)"/>
                </g>
                <g transform="translate(100,115)">
                    <ellipse rx="3" ry="6" transform="rotate(0)"/>
                    <ellipse rx="3" ry="6" transform="rotate(60)"/>
                    <ellipse rx="3" ry="6" transform="rotate(120)"/>
                    <ellipse rx="3" ry="6" transform="rotate(180)"/>
                    <ellipse rx="3" ry="6" transform="rotate(240)"/>
                    <ellipse rx="3" ry="6" transform="rotate(300)"/>
                </g>
                <g transform="translate(130,95)">
                    <ellipse rx="4" ry="7" transform="rotate(0)"/>
                    <ellipse rx="4" ry="7" transform="rotate(60)"/>
                    <ellipse rx="4" ry="7" transform="rotate(120)"/>
                    <ellipse rx="4" ry="7" transform="rotate(180)"/>
                    <ellipse rx="4" ry="7" transform="rotate(240)"/>
                    <ellipse rx="4" ry="7" transform="rotate(300)"/>
                </g>
            </g>
            <g fill="#FF8C00" opacity="0.7">
                <circle cx="70" cy="135" r="1.5"/>
                <circle cx="100" cy="115" r="1.5"/>
                <circle cx="130" cy="95" r="1.5"/>
            </g>
            <g stroke="#228B22" stroke-width="1" fill="#90EE90" opacity="0.6">
                <ellipse cx="60" cy="145" rx="5" ry="8"/>
                <ellipse cx="90" cy="125" rx="4" ry="7"/>
                <ellipse cx="120" cy="105" rx="5" ry="8"/>
                <ellipse cx="140" cy="85" rx="4" ry="6"/>
            </g>
        </svg>`;
    }