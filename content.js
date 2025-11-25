// Content script for GMGN Filter Extension
(function () {
    'use strict';

    // Store existing table rows to detect new ones


    let device_id;
    let client_id;
    let from_app;
    let app_ver;
    let tz_name;
    let tz_offset;
    let app_lang;
    let fp_did;
    let os;
    let wallet;

    let rows = [];
    let tokens = [];
    let tokenInfo = {}
    let tokenIndex = 0;

    let filters = null;

    let opened_browsers = 0;
    let filtered_tokens = []


    //drag
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const svgs = {
        sniper: `<svg width="12px" height="12px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M7.29012.667272C7.29012.299085 7.5886.000610347 7.95679.000610347H8.04635C8.41453.000610347 8.71301.299085 8.71301.667272V1.76411C8.71301 2.13229 8.41453 2.43077 8.04635 2.43077H7.95678C7.5886 2.43077 7.29012 2.13229 7.29012 1.76411V.667272ZM7.29011 14.0659C7.29011 13.6977 7.58858 13.3992 7.95677 13.3994h8.04633C8.41452 13.3992 8.71299 13.6977 8.71299 14.0659V15.3333C8.71299 15.7015 8.41452 16 8.04633 16H7.95677C7.58858 16 7.29011 15.7015 7.29011 15.3333V14.0659ZM.666662 8.70702C.298475 8.707021.70265e-8 8.408543.02996e-9 8.04036L0 7.96065C-1.39966e-8 7.59246.298475 7.29399.666662 7.29399H1.92939C2.29757 7.29399 2.59605 7.59246 2.59605 7.96065V8.04036C2.59605 8.40854 2.29758 8.70702 1.92939 8.70704h.666662ZM14.0615 8.70702C13.6933 8.70702 13.3948 8.40854 13.3948 8.04036V7.96065C13.3948 7.59246 13.6933 7.29399 14.0615 7.29399H15.3333C15.7014 7.29399 15.9999 7.59246 15.9999 7.96065V8.04036C15.9999 8.40854 15.7014 8.70702 15.3333 8.70704h14.0615Z"></path><path d="M8.00078 1.47549C11.604 1.47559 14.5251 4.39663 14.5251 7.99985C14.525 11.603 11.6039 14.5241 8.00078 14.5242C4.39755 14.5242 1.47651 11.6031 1.47641 7.99985C1.47641 4.39657 4.39749 1.47549 8.00078 1.47549ZM7.99882 2.8788C5.17067 2.8788 2.87779 5.1717 2.87777 7.99985C2.87777 10.828 5.17065 13.1209 7.99882 13.1209C10.827 13.1209 13.1199 10.828 13.1199 7.99985C13.1199 5.17171 10.827 2.87881 7.99882 2.8788Z"></path><path d="M9.74323 8.00613C9.74323 8.9418 8.98472 9.70031 8.04905 9.70031C7.11337 9.70031 6.35486 8.9418 6.35486 8.00613C6.35486 7.07046 7.11337 6.31195 8.04905 6.31195C8.98472 6.31195 9.74323 7.07046 9.74323 8.00613Z"></path></svg>`,
        website: '<svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" size="14" class="transition-colors fill-text-200 hover:fill-text-100"><path d="M1.72364 7.33125H4.68345C4.79929 5.06032 5.49543 3.20614 6.35574 1.90616C3.87565 2.57306 1.9994 4.71364 1.72364 7.33125ZM8.02648 1.92436C7.11851 2.92475 6.1673 4.78652 6.02287 7.33125H10.0962C9.95819 4.64377 8.99772 2.87372 8.02648 1.92436ZM10.0944 8.6688H6.02762C6.10776 9.81683 6.38662 10.9389 6.77871 11.9133C7.13552 12.8001 7.5723 13.5311 8.00841 14.042C9.0195 12.9596 9.95189 11.1743 10.0944 8.6688ZM6.39948 14.1055C6.07651 13.6003 5.78476 13.0263 5.53785 12.4126C5.08819 11.2951 4.76914 10.002 4.68721 8.6688H1.72364C2.00102 11.3018 3.89773 13.4521 6.39948 14.1055ZM9.69255 14.0798C12.1471 13.3973 13.9994 11.2683 14.2732 8.6688H11.4338C11.3174 10.9536 10.6108 12.7654 9.69255 14.0798ZM14.2732 7.33125C14.0028 4.76388 12.1927 2.6554 9.78327 1.94618C10.6607 3.21134 11.3271 5.01157 11.4353 7.33125H14.2732ZM0.351074 8.00002C0.351074 3.7765 3.77492 0.352661 7.99844 0.352661C12.222 0.352661 15.6458 3.7765 15.6458 8.00002C15.6458 12.2235 12.222 15.6474 7.99844 15.6474C3.77492 15.6474 0.351074 12.2235 0.351074 8.00002Z"></path></svg>',
        youtube: '<svg width="14" height="14" viewBox="0 0 17 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" size="14"><rect x="5.56445" y="5.19727" width="6.00977" height="6.00977" fill="white"></rect><path d="M6.66667 10.3069V5.64022L10.6667 7.98155L6.66667 10.3069ZM15.84 4.75155C15.84 4.75155 15.6833 3.64155 15.204 3.15222C14.5953 2.51022 13.9133 2.50755 13.6007 2.47022C11.362 2.30688 8.00333 2.30688 8.00333 2.30688H7.99667C7.99667 2.30688 4.638 2.30688 2.39933 2.47022C2.086 2.50755 1.40467 2.51022 0.795333 3.15222C0.316 3.64155 0.16 4.75222 0.16 4.75222C0.16 4.75222 0 6.05488 0 7.35822V8.58155C0 9.88555 0.16 11.1896 0.16 11.1896C0.16 11.1896 0.316 12.2996 0.795333 12.7889C1.40467 13.4309 2.204 13.4102 2.56 13.4776C3.84 13.6022 8 13.6402 8 13.6402C8 13.6402 11.362 13.6349 13.6007 13.4722C13.914 13.4342 14.5953 13.4316 15.204 12.7895C15.684 12.3002 15.84 11.1896 15.84 11.1896C15.84 11.1896 16 9.88622 16 8.58222V7.35955C16 6.05555 15.84 4.75155 15.84 4.75155Z" fill="#FF0000"></path></svg>',
        x_status: '<svg width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-100 hover:text-text-100"><path d="M13.2115 1.9254C8.98169 2.49365 6.5222 4.65425 5.07285 7.16716C4.09031 8.87071 3.56469 10.7519 3.29542 12.4395C3.48013 12.1434 3.67039 11.8669 3.86747 11.6132C4.54894 10.7356 5.35699 10.0714 6.35729 9.8491C6.53174 9.81033 6.70403 9.77269 6.87409 9.73553C9.23493 9.21967 11.1662 8.79768 12.4793 6.77543L11.029 6.12287C10.4692 5.87096 10.4361 5.12757 10.9023 4.79732C12.125 3.93107 12.8369 2.74276 13.2115 1.9254ZM13.9742 0.537759C14.4488 0.500404 14.9422 0.947268 14.7625 1.519C14.5922 2.0606 13.9414 3.85655 12.3556 5.29422L13.6571 5.87986C14.0159 6.04132 14.1408 6.46249 13.9732 6.7868C12.3754 9.87966 9.72443 10.4514 7.21436 10.9929C7.02166 11.0344 6.8298 11.0758 6.6393 11.1181C6.04798 11.2495 5.47649 11.6607 4.89421 12.4105C4.31141 13.161 3.76284 14.1929 3.20553 15.4576C3.04473 15.8225 2.67138 15.9624 2.35904 15.9018C2.03891 15.8398 1.73409 15.5547 1.74517 15.1358C1.80365 12.9259 2.22339 9.50562 3.94673 6.51765C5.69238 3.49102 8.75637 0.948472 13.9742 0.537759Z"></path></svg>',
        x_community: '<svg width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-100 group-hover:text-text-100"><path d="M5.90137 10.7862C5.90137 9.64485 4.97626 8.71984 3.83496 8.71976 2.69359 8.71976 1.76855 9.64479 1.76855 10.7862V13.9741H5.90137V10.7862ZM7.20117 14.1763C7.20115 14.7827 6.70991 15.2747 6.10352 15.2749H1.56641C.959868 15.2748.467798 14.7828.467773 14.1763V10.7862C.467773 8.92682 1.97562 7.41898 3.83496 7.41898 5.69423 7.41906 7.20117 8.92687 7.20117 10.7862V14.1763ZM14.1555 10.7862C14.1555 9.64485 13.2304 8.71984 12.0891 8.71976 10.9477 8.71976 10.0227 9.64479 10.0227 10.7862V13.9741H14.1555V10.7862ZM15.4553 14.1763C15.4553 14.7827 14.964 15.2747 14.3576 15.2749H9.82053C9.21399 15.2748 8.72192 14.7828 8.7219 14.1763V10.7862C8.7219 8.92682 10.2297 7.41898 12.0891 7.41898 13.9484 7.41906 15.4553 8.92687 15.4553 10.7862V14.1763ZM5.07078 3.81714C5.07056 3.13462 4.51702 2.58179 3.83445 2.58179 3.15207 2.582 2.59932 3.13475 2.5991 3.81714 2.5991 4.49971 3.15193 5.05325 3.83445 5.05347 4.51715 5.05347 5.07078 4.49984 5.07078 3.81714ZM6.37058 3.81714C6.37058 5.21781 5.23512 6.35327 3.83445 6.35327 2.43396 6.35306 1.29832 5.21768 1.29832 3.81714 1.29853 2.41678 2.4341 1.28122 3.83445 1.28101 5.23499 1.28101 6.37037 2.41665 6.37058 3.81714ZM13.3249 3.81714C13.3247 3.13462 12.7711 2.58179 12.0886 2.58179 11.4062 2.582 10.8534 3.13475 10.8532 3.81714 10.8532 4.49971 11.4061 5.05325 12.0886 5.05347 12.7713 5.05347 13.3249 4.49984 13.3249 3.81714ZM14.6247 3.81714C14.6247 5.21781 13.4892 6.35327 12.0886 6.35327 10.6881 6.35306 9.55244 5.21768 9.55244 3.81714 9.55266 2.41678 10.6882 1.28122 12.0886 1.28101 13.4891 1.28101 14.6245 2.41665 14.6247 3.81714Z"></path></svg>',
        x_search: '<svg width="14px" height="14px" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-text-200"><path d="M9.28947 0.829834H11.0436L7.21136 5.20982L11.7197 11.17H8.1897L5.4249 7.55518L2.26134 11.17H0.506166L4.60511 6.48511L0.280273 0.829834H3.89986L6.399 4.13391L9.28947 0.829834ZM8.67383 10.1201H9.64581L3.37172 1.82461H2.32869L8.67383 10.1201Z"></path></svg>',
        x_profile: '<svg width="14px" height="14px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="text-blue-100 group-hover:text-text-100"><path d="M7.18994 9.37073C4.57067 9.37073 2.43132 11.4269 2.29932 14.0133H13.4321C13.3001 11.4269 11.1607 9.37081 8.5415 9.37073H7.18994ZM14.7378 14.2672C14.7377 14.8449 14.2696 15.3131 13.6919 15.3131H2.03955C1.46182 15.3131.992781 14.8449.992676 14.2672.992676 10.8449 3.76761 8.06995 7.18994 8.06995H8.5415C11.9638 8.07003 14.7378 10.8449 14.7378 14.2672ZM10.0044 3.88647C10.0042 2.77949 9.10655 1.88257 7.99951 1.88257 6.89267 1.8828 5.99584 2.77963 5.99561 3.88647 5.99561 4.99351 6.89253 5.89113 7.99951 5.89136 9.10669 5.89136 10.0044 4.99365 10.0044 3.88647ZM11.3042 3.88647C11.3042 5.71162 9.82466 7.19116 7.99951 7.19116 6.17456 7.19093 4.69482 5.71148 4.69482 3.88647 4.69506 2.06166 6.1747.582018 7.99951.581787 9.82452.581787 11.304 2.06152 11.3042 3.88647Z"></path></svg>',
        tiktok: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" size="14"><path d="M11.4514 5.77534C12.515 6.53984 13.7922 6.95033 15.102 6.94867V4.31867C14.844 4.31867 14.5874 4.29201 14.3354 4.23801V6.30734C13.0254 6.30929 11.7479 5.89903 10.684 5.13467V10.5C10.684 13.184 8.51605 15.3593 5.84205 15.3593C4.88166 15.3607 3.94287 15.0744 3.14672 14.5373C3.59637 15.0006 4.13453 15.3688 4.72924 15.6201C5.32396 15.8713 5.9631 16.0005 6.60872 16C9.28271 16 11.4514 13.8247 11.4514 11.14V5.776V5.77534ZM12.3967 3.12334C11.8555 2.53082 11.5235 1.77724 11.4514 0.978013V0.640013H10.7247C10.8139 1.14798 11.0088 1.63155 11.2968 2.05935C11.5849 2.48716 11.9596 2.84965 12.3967 3.12334ZM4.83805 12.4787C4.54401 12.0916 4.38521 11.6187 4.38605 11.1327C4.38559 10.7838 4.46738 10.4398 4.62478 10.1286C4.78218 9.81727 5.01076 9.54748 5.29196 9.34109C5.57317 9.13471 5.89907 8.99753 6.24322 8.94069C6.58738 8.88386 6.94008 8.90897 7.27271 9.014V6.32667C7.01895 6.29165 6.76283 6.27671 6.50672 6.282V8.374C6.17409 8.26898 5.82138 8.24386 5.47723 8.3007C5.13307 8.35753 4.80717 8.49471 4.52596 8.7011C4.24476 8.90748 4.01618 9.17727 3.85878 9.48855C3.70138 9.79984 3.61959 10.1438 3.62005 10.4927C3.62005 11.3607 4.11539 12.1127 4.83805 12.4787Z" fill="#FF004F"></path><path d="M10.6841 5.13534C11.748 5.89965 13.0254 6.30991 14.3354 6.308V4.23867C13.5887 4.07817 12.9109 3.68819 12.3968 3.12334C11.9597 2.84962 11.585 2.48711 11.2969 2.05931C11.0089 1.63152 10.814 1.14797 10.7248 0.640013H8.8161V11.14C8.81522 11.7272 8.58165 12.2901 8.16654 12.7055C7.75144 13.1208 7.18865 13.3548 6.60143 13.356C6.25968 13.3561 5.92257 13.2769 5.6166 13.1247C5.31063 12.9725 5.04414 12.7513 4.8381 12.4787C4.47113 12.2928 4.16292 12.0087 3.94777 11.6581C3.73262 11.3075 3.61896 10.904 3.61944 10.4927C3.61898 10.1438 3.70076 9.79984 3.85816 9.48855C4.01557 9.17727 4.24414 8.90748 4.52535 8.7011C4.80655 8.49471 5.13246 8.35753 5.47661 8.3007C5.82077 8.24386 6.17347 8.26898 6.5061 8.374V6.282C3.87944 6.33667 1.76611 8.49066 1.76611 11.1407C1.76611 12.4633 2.29278 13.662 3.14677 14.538C3.94292 15.0751 4.88172 15.3614 5.8421 15.36C8.51676 15.36 10.6841 13.184 10.6841 10.5V5.13601V5.13534Z" fill="white"></path><path d="M14.3353 4.23866V3.67866C13.6497 3.67983 12.9777 3.48733 12.3966 3.12333C12.9106 3.68839 13.5885 4.0784 14.3353 4.23866ZM10.7246 0.639999C10.7072 0.539917 10.6939 0.439167 10.6846 0.337999V0H8.04932V10.5C8.04862 11.0873 7.8151 11.6503 7.39996 12.0657C6.98482 12.4811 6.42193 12.7149 5.83466 12.716C5.48839 12.7164 5.1469 12.6351 4.83799 12.4786C5.04403 12.7513 5.31052 12.9724 5.61649 13.1247C5.92246 13.2769 6.25957 13.3561 6.60132 13.356C7.18843 13.3547 7.75112 13.1209 8.1662 12.7057C8.58128 12.2905 8.81493 11.7277 8.81599 11.1406V0.639999H10.7246ZM6.50666 6.28199V5.68666C6.28662 5.65643 6.06477 5.64128 5.84266 5.64132C3.168 5.64132 1 7.81665 1 10.5006C0.999076 11.2981 1.19441 12.0835 1.56878 12.7876C1.94315 13.4917 2.48505 14.0928 3.14666 14.538C2.25998 13.6296 1.76456 12.41 1.76667 11.1406C1.76667 8.49132 3.88 6.33665 6.50666 6.28199Z" fill="#00F2EA"></path></svg>',
    }

    // Platform image mapping
    const platformImages = {
        'Pump.fun': 'https://dd.dexscreener.com/ds-data/dexes/pumpfun.png',
        'letsbonk': 'https://bonkcoin.com/favicon.ico',
        'ray_launchpad': 'https://raydium.io/favicon.ico',
        'meteora_virtual_curve': 'https://www.meteora.ag/icons/v2/logo.svg',
        'believe': 'https://believe.app/images/icons/believe.png',
        'moonshot_app': 'https://moonshot.watch/favicon.ico',
        'Moonshot': 'https://moon.it/favicon.ico',
        'jup_studio': 'https://jup.ag/favicon.ico',
        'bags': 'https://bags.fm/favicon.ico',
        'heaven': 'https://axiom.trade/images/heaven.svg',
        'fourmeme': 'https://four.meme/_next/static/media/logo.fd63b04b.svg',
        'flap': 'https://bnb.flap.sh/_next/image?url=%2Flogo.png&w=640&q=75',
        'bn_fourmeme': 'https://img.icons8.com/?size=100&id=2963&format=png&color=FAB005',
        'nadfun': 'https://s2.coinmarketcap.com/static/img/coins/64x64/30495.png'
    };

    // Wait for the page to load
    function init() {
        // Check if we're on the correct page
        if (!window.location.href.includes('gmgn.ai/monad/address/')) {
            return;
        }

        wallet = window.location.href.split('/').pop().split('_').pop();

        filters = getCurrentFilters();

        // Set configuration from local storage
        initializeConfiguration();

        // Create and inject the filter icon
        createFilterIcon();

        // Create the filter dialog (hidden initially)
        createFilterDialog();

        // Start monitoring for new table rows
        startTableRowMonitoring();

        // start get token info
        startGetTokenInfo();

        // setup drag
        startDrag();
    }

    function startDrag() {
        const draggable = document.getElementById('draggable');

        xOffset = localStorage.getItem('xOffset') || 0
        yOffset = localStorage.getItem('yOffset') || 0
        currentX = localStorage.getItem('xPos') || "-50%"
        currentY = localStorage.getItem('yPos') || 0

        setTranslate(xOffset, yOffset, draggable)


        draggable.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.id != "draggable") {
                return;
            }
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, draggable);

            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            localStorage.setItem("xPos", currentX);
            localStorage.setItem("yPos", currentY);
            localStorage.setItem("xOffset", xOffset);
            localStorage.setItem("yOffset", yOffset);

        }

        function setTranslate(xPos, yPos, el) {

            el.style.transform = `translate3d(calc(-50% + ${xPos}px), ${yPos}px, 0)`;
        }
    }

    function isFiltered(tokenAddress) {

        if (filters == null) return false;
        if (tokenInfo[tokenAddress] == undefined || tokenInfo[tokenAddress] == null) return false;

        const data = tokenInfo[tokenAddress];
        if (filters.platforms.length > 0 && !filters.platforms.includes(data.platform))
            return false;

        let filters_cnt = 0;
        const buy_mc = data.first_buy_mc
        const buy_amount = data.first_buy_amount

        if (filters.firstBuyMc.min == '') filters_cnt++;
        else if (Number(filters.firstBuyMc.min) >= 0 && Number(buy_mc) >= Number(filters.firstBuyMc.min)) filters_cnt++;

        if (filters.firstBuyMc.max == '') filters_cnt++;
        else if (Number(filters.firstBuyMc.max) >= 0 && Number(buy_mc) <= Number(filters.firstBuyMc.max)) filters_cnt++;

        if (filters.firstBuyAmount.min == '') filters_cnt++;
        else if (Number(filters.firstBuyAmount.min) >= 0 && Number(buy_amount) >= Number(filters.firstBuyAmount.min)) filters_cnt++;

        if (filters.firstBuyAmount.max == '') filters_cnt++;
        else if (Number(filters.firstBuyAmount.max) >= 0 && Number(buy_amount) <= Number(filters.firstBuyAmount.max)) filters_cnt++;

        if (filters.maxTokenAge == '' || data.first_tx_time <= Number(filters.maxTokenAge) + Number(data.created_block_time))
            filters_cnt++;

        if (filters.minTokenAge == '' || data.first_tx_time >= Number(filters.minTokenAge) + Number(data.created_block_time))
            filters_cnt++;

        if (filters_cnt == 6)
            return true
        return false;
    }

    function applyFilterToRow(tokenAddress) {

        const row = rows.find(row => row.querySelector('a').href.split('/').pop().includes(tokenAddress));
        if (!row) return;
        const info = tokenInfo[tokenAddress]
        if (info == null || info == undefined) return
        const tds = row.querySelectorAll('td');
        const holdingTd = tds[6];
        const holding_duration = tds[6].innerText //1d, 3m, 2h, 1s

        // Parse holding duration and apply color logic
        const durationInSeconds = parseDurationToSeconds(holding_duration);
        if (durationInSeconds < 5) {
            holdingTd.setAttribute('holding_duration_color', 'red');
        } else if (durationInSeconds < 10) {
            holdingTd.setAttribute('holding_duration_color', 'yellow');
        }

        const firstTd = tds[0];
        const token_age = firstTd.getAttribute('token_age');

        // Add first buy MC information to 8th td (index 7)
        const eighthTd = tds[7];
        if (eighthTd && !eighthTd.hasAttribute('first_buy_mc_added')) {
            eighthTd.setAttribute('first_buy_mc_added', 'true');
            eighthTd.style.position = 'relative';

            const athInfoContainer = document.createElement('div');
            athInfoContainer.className = 'ath-info-container';
            athInfoContainer.style.cssText = `
                position: absolute;
                top: 50%;
                right: -4px;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                font-size: 10px;
                color: #888;
                z-index: 1;
                font-size:12px;
                max-width:55px;
                min-width:55px;
            `;
            // Create first buy MC display
            const firstBuyMcDiv = document.createElement('div');
            firstBuyMcDiv.textContent = `${formatATH(info.first_buy_mc * 1000)}`;
            firstBuyMcDiv.style.cssText = `
            padding: 1px 3px;
            border-radius: 2px;
            background: rgba(0, 0, 0);
            color: #8f8;
            text-align: center;
        `;

            const firstBuySolDiv = document.createElement('div');
            firstBuySolDiv.textContent = `${info.first_buy_amount.toFixed(2)}`;
            firstBuySolDiv.style.cssText = `
            padding: 1px 3px;
            border-radius: 2px;
            background: rgba(0, 0, 0);            
            text-align: center;
        `;

            athInfoContainer.appendChild(firstBuyMcDiv);

            athInfoContainer.appendChild(firstBuySolDiv);

            // Append to 8th td

            eighthTd.appendChild(athInfoContainer);
        }

        // Add ATH information to 9th td (index 8)
        const ninthTd = tds[8];
        if (ninthTd && !ninthTd.hasAttribute('ath_info_added')) {
            ninthTd.setAttribute('ath_info_added', 'true');
            ninthTd.style.position = 'relative';

            // Create ATH info container
            const athInfoContainer = document.createElement('div');
            athInfoContainer.className = 'ath-info-container';
            athInfoContainer.style.cssText = `
                position: absolute;
                top: 50%;
                right: 4px;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                font-size: 10px;
                color: #888;
                z-index: 1;
                font-size:12px;
                min-width:100px;
            `;

            // Create ATH 4h display
            const ath4hDiv = document.createElement('div');
            ath4hDiv.textContent = `${formatATH(info.ath_4h)} \n (${formatTokenAge(info.ath_4h_duration)})`;
            ath4hDiv.style.cssText = `
                padding: 1px 3px;
                border-radius: 2px;
                background: rgba(0, 0, 0);
                text-align: center;
            `;

            // Create ATH Hold display
            const athHoldDiv = document.createElement('div');
            athHoldDiv.textContent = `${formatATH(info.ath_hold)} \n (${formatTokenAge(info.ath_hold_duration)})`;
            athHoldDiv.style.cssText = `
                padding: 1px 3px;
                border-radius: 2px;
                background: rgba(0, 0, 0);
                color: #f88;
                text-align: center;
            `;

            athInfoContainer.appendChild(athHoldDiv);
            athInfoContainer.appendChild(ath4hDiv);

            // Append to 9th td
            ninthTd.appendChild(athInfoContainer);
        }

        const tenthTd = tds[9];
        if (tenthTd && !tenthTd.hasAttribute('ath_info_added')) {
            tenthTd.setAttribute('ath_info_added', 'true');
            tenthTd.style.position = 'relative';

            // Create ATH info container
            const athInfoContainer = document.createElement('div');
            athInfoContainer.className = 'ath-info-container';
            athInfoContainer.style.cssText = `
                position: absolute;
                top: 50%;
                right: 4px;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                font-size: 10px;
                color: #888;
                z-index: 1;
                font-size:12px;
                min-width:100px;
            `;

            // Social Info container
            const socialInfoContainer = document.createElement('div');
            socialInfoContainer.className = 'ath-info-container';
            socialInfoContainer.style.cssText = `
                position: absolute;
                top: 50%;
                right: -110px;
                transform: translateY(-50%);
                display: flex;
                flex-direction: row;
                gap: 3px;
                font-size: 10px;
                color: #888;
                z-index: 1;
                font-size:12px;
                min-width:100px;
            `;

            // Create ATH 4h display
            const ath4hDiv = document.createElement('div');
            ath4hDiv.textContent = `${formatPNL(info.pnl_4h)}%`;
            ath4hDiv.style.cssText = `
                padding: 1px 3px;
                border-radius: 2px;
                background: rgba(0, 0, 0);
                text-align: center;                
                color:${info.pnl_4h > 0 ? "#8f8" : "#f88"};
            `;

            // Create ATH Hold display
            const athHoldDiv = document.createElement('div');
            athHoldDiv.textContent = `${formatPNL(info.pnl_hold)}%`;
            athHoldDiv.style.cssText = `
                padding: 1px 3px;
                border-radius: 2px;
                background: rgba(0, 0, 0);
                color:${info.pnl_hold > 0 ? "#8f8" : "#f88"};
                text-align: center;
            `;

            athInfoContainer.appendChild(athHoldDiv);
            athInfoContainer.appendChild(ath4hDiv);


            // Append to 9th td
            tenthTd.appendChild(athInfoContainer);


            //
            socialInfoContainer.innerHTML = info.links.x + info.links.tiktok + info.links.youtube + info.links.website
            tenthTd.appendChild(socialInfoContainer);

        }

        if (token_age == null || token_age == undefined) {
            firstTd.setAttribute('token_age', info.first_tx_time - info.created_block_time)

            const aTag = firstTd.querySelector('a');
            aTag.href = aTag.href + `?maker=${wallet}`

            // Create container for token age and platform info
            const tokenInfoContainer = document.createElement('div');
            tokenInfoContainer.className = 'token-info-container';
            tokenInfoContainer.style.cssText = `
                position: absolute;
                top: 8px;
                right: 4px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
                pointer-events: none;
                z-index: 1;
            `;

            // Create platform and migration info container
            const platformMigrationContainer = document.createElement('div');
            platformMigrationContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 4px;
            `;

            // Create migration block time display (if migration occurred)
            if (info.migration_block_time > 0) {
                const migrationTimeDiv = document.createElement('div');

                migrationTimeDiv.textContent = `${formatTokenAge(info.migration_block_time - info.created_block_time)}`
                migrationTimeDiv.style.cssText = `
                    font-size: 11px;
                    color: #8f8;
                    background-color:#111;
                    text-align: center;
                    padding: 1px 3px;
                `;

                platformMigrationContainer.appendChild(migrationTimeDiv);
            }

            if (info.launchpad && platformImages[info.launchpad]) {
                const platformImg = document.createElement('img');
                platformImg.src = platformImages[info.launchpad];

                if (info.launchpad == 'bn_fourmeme') {
                    console.log("Four.meme BN:", tokenAddress, info.launchpad, platformImages[info.launchpad])
                }
                
                // if (tokenAddress.startsWith("0x4444")) {
                //     console.log("Global:", tokenAddress, chrome.runtime.getURL("global.png"))
                //     platformImg.src = chrome.runtime.getURL("global.png");
                // }
                platformImg.alt = info.launchpad;

                platformImg.onload = function () {
                    if (platformImg.naturalWidth > platformImg.naturalHeight) {
                        platformImg.style.objectPosition = 'left';
                    }
                };

                const borderColor = info.migration_block_time > 0 ? 'rgba(255, 230, 9, 0.8)' : 'rgba(255, 255, 255, 0)';
                const borderWidth = info.migration_block_time > 0 ? '2px' : '0px';

                platformImg.style.cssText = `
                    width: 20px;
                    height: 20px;
                    border-radius: 5px;
                    object-fit: cover;
                    outline: ${borderWidth} solid ${borderColor};
                    cursor: pointer;
                `;
                platformImg.title = info.launchpad; // Add tooltip

                platformImg.onerror = function () {
                    // Create fallback platform indicator
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.textContent = info.platform.substring(0, 2).toUpperCase();
                    fallbackDiv.style.cssText = `
                        width: 16px;
                        height: 16px;
                        border-radius: 2px;                        
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 8px;
                        color: white;
                        font-weight: bold;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        cursor: pointer;
                    `;
                    fallbackDiv.title = info.platform; // Add tooltip
                    platformMigrationContainer.replaceChild(fallbackDiv, platformImg);
                    
                };

                platformMigrationContainer.appendChild(platformImg);
            }

            // Add the platform and migration container to the main container
            tokenInfoContainer.appendChild(platformMigrationContainer);

            // Create token age display
            const tokenAgeDiv = document.createElement('div');
            tokenAgeDiv.className = 'token-age-display';

            const ageInSeconds = info.first_tx_time - info.created_block_time;
            const isSnipe = ageInSeconds >= 0 && ageInSeconds <= 3 && !info.dev;

            if (info.dev == false) {
                if (isSnipe) {
                    // Show snipe icon + token age
                    tokenAgeDiv.innerHTML = `
                         <div style="display: flex; align-items: center; gap: 3px;">
                            ${svgs.sniper}
                             <span>${formatTokenAge(ageInSeconds)}</span>
                         </div>
                     `;
                } else {
                    tokenAgeDiv.innerHTML = `${formatTokenAge(ageInSeconds)}`;
                }
            } else {
                // https://statics.solscan.io/solscan-img/token_creator_icon.svg
                tokenAgeDiv.innerHTML = `<img width="14" height="14" src="https://statics.solscan.io/solscan-img/token_creator_icon.svg" style="color: transparent; border-radius: 5px; height: 100%; object-fit: cover; left: 0px;"/>`;
            }

            let textColor;
            if (ageInSeconds < 10) {
                textColor = '#4CAF50'; // Green
            } else if (ageInSeconds < 60) {
                textColor = '#FF9800'; // Orange
            } else if (ageInSeconds < 300) { // 5 minutes
                textColor = '#F44336'; // Red
            } else {
                textColor = '#9E9E9E'; // Gray
            }

            tokenAgeDiv.style.cssText = `
                font-size: 11px;
                padding: 1px 3px;
                border-radius: 2px;
                color: ${textColor};
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            `;

            tokenInfoContainer.appendChild(tokenAgeDiv);

            // Append the container to firstTd
            firstTd.appendChild(tokenInfoContainer);
        }

        if (isFiltered(tokenAddress)) {

            filtered_tokens.push(tokenAddress);

            row.classList.add('selected-filter');

            Array.from(row.querySelectorAll('td')).forEach(td => {
                td.classList.add('selected-filter');
            });
        }
        else {
            row.classList.remove('selected-filter');
            Array.from(row.querySelectorAll('td')).forEach(td => {
                td.classList.remove('selected-filter');
            });
        }
    }

    function startGetTokenInfo() {
        setInterval(async () => {
            try {
                // get token detail like platforms, first buy mc, first buy amount, first buy timestamp, first sell timestamp
                if (tokenIndex >= tokens.length) {
                    return;
                }
                const tokenAddress = tokens[tokenIndex];
                tokenIndex++;
                const tokenDetail = await fetch(`https://gmgn.ai/api/v1/mutil_window_token_security_launchpad/monad/${tokenAddress}?device_id=${device_id}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&fp_did=${fp_did}&os=${os}`);
                const tokenDetailData = await tokenDetail.json(); 

                let transactions = [];

                let cursor = ""
                while (1) {
                    const activites = await fetch(`https://gmgn.ai/vas/api/v1/wallet_activity/monad?type=buy&type=sell&device_id=${device_id}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&fp_did=${fp_did}&os=${os}&wallet=${wallet}&token=${tokenAddress}&limit=50&cursor=${cursor}`);

                    const activitesData = await activites.json();

                    transactions = [...transactions, ...activitesData.data.activities];

                    if (activitesData.data.next == "") {
                        break;
                    } else {
                        cursor = activitesData.data.next;
                    }
                }

                const txs = transactions

                if (transactions.length == 0) return
                
                const lastTx = txs[txs.length - 1];
                const firstTx = txs[0];
            

                let first_sell_all_time = 0;
                let last_tx_time = firstTx.timestamp
                let first_tx_time = lastTx.timestamp
                let first_buy_mc = lastTx.price_usd * lastTx.token.total_supply / 1000;
                let first_buy_amount = Number(lastTx.quote_amount);
                if (lastTx.quote_token.name == "Tether USD") {
                    first_buy_amount = first_buy_amount / 1200
                } else if (lastTx.quote_token.name == "World Liberty Financial USD") {
                    first_buy_amount = first_buy_amount / 1200
                } else if (lastTx.quote_token.name == "Aster") {
                    first_buy_amount = first_buy_amount / 1.3
                }
                console.log(tokenAddress,"First tx:", first_tx_time, first_buy_mc, first_buy_amount)

                let token_amount_left = 0;
                let first_buy_token_amount = 0
                for (let i = txs.length - 1; i >= 0; i--) {
                    if (txs[i].event_type == 'buy') {
                        token_amount_left += parseFloat(txs[i].token_amount)


                    } else {
                        token_amount_left -= parseFloat(txs[i].token_amount)
                        if (token_amount_left <= 500000) {
                            first_sell_all_time = txs[i].timestamp
                            break;
                        }
                    }
                }


                const rug_info = await fetch(`https://gmgn.ai/api/v1/mutil_window_token_link_rug_vote/monad/${tokenAddress}?device_id=${device_id}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&fp_did=${fp_did}&os=${os}`, {
                    method: 'GET',

                });
                const rug_info_data = (await rug_info.json()).data.link;
                const links = {
                    x: '',
                    website: '',
                    telegram: '',
                    youtube: '',
                    facebook: '',
                    tiktok: ''
                }

                // link management
                if (rug_info_data.twitter_username != '') {
                    if (rug_info_data.twitter_username.startsWith('search')) links.x = svgs.x_search
                    else if (rug_info_data.twitter_username.startsWith('i/communities')) links.x = svgs.x_community
                    else if (rug_info_data.twitter_username.includes('/status'))
                        links.x = svgs.x_status
                    else links.x = svgs.x_status
                }
                if (rug_info_data.tiktok != '' || rug_info_data.website.includes("tiktok.com")) links.tiktok = svgs.tiktok

                else if (rug_info_data.youtube != '' || rug_info_data.website.includes("youtu"))
                    links.youtube = svgs.youtube
                else if (rug_info_data.website != '')
                    links.website = svgs.website



                const migration_info = await fetch(`https://gmgn.ai/api/v1/mutil_window_token_info?device_id=${device_id}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&fp_did=${fp_did}&os=${os}`, {
                    method: 'POST',
                    body: JSON.stringify({ chain: "monad", addresses: [tokenAddress] })
                });

                const migration_info_data = await migration_info.json();

                let migration_block_time = 0;
                let ath_hold_block_time = 0;
                let ath_4h_block_time = 0;
                let created_block_time = 0;
                let dev = false;
                let dev_address = "";
                for (let pool of migration_info_data.data) {
                    if (created_block_time == 0 && pool?.creation_timestamp > 0) {
                        created_block_time = pool?.creation_timestamp
                    }
                    if (created_block_time == 0 || pool.pool.creation_timestamp > 0 && pool.pool.creation_timestamp < created_block_time) {
                        created_block_time = pool.pool.creation_timestamp
                    }
                    if (dev == false && pool.dev.creator_address == wallet) {
                        dev = true
                    }
                    dev_address = pool.dev.creator_address
                    if (dev_address == "") {
                        dev_address = pool.dev.address
                    }
                }

                for (let pool of migration_info_data.data) {
                    if (pool.migrated_timestamp > 0) {
                        migration_block_time = pool.migrated_timestamp
                    }
                }

                // if (dev_address != "") {
                //     try {
                //         let dev_transactions = [];
                //         let dev_cursor = ""
                //         console.log("Dev:", tokenAddress, dev_address)
                //         while (1) {
                //             const activites = await fetch(`https://gmgn.ai/api/v1/wallet_activity/bsc?type=buy&type=sell&device_id=${device_id}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&fp_did=${fp_did}&os=${os}&wallet=${dev_address}&token=${tokenAddress}&limit=50&cursor=${dev_cursor}`);

                //             const activitesData = await activites.json();

                //             dev_transactions = [...dev_transactions, ...activitesData.data.activities];

                //             if (activitesData.data.next == "") {
                //                 break;
                //             } else {
                //                 dev_cursor = activitesData.data.next;
                //             }
                //         }

                //         const dev_txs = dev_transactions
                //         if (dev_txs.length > 0) {
                //             const lastDevTx = dev_txs[dev_txs.length - 1];
                //             console.log("LastDevTx:", lastDevTx)
                //             if (created_block_time > lastDevTx.timestamp) {
                //                 created_block_time = lastDevTx.timestamp
                //             }
                //         }
                //     } catch(e) {
                        
                //     }
                // }

                try {
                    let dev_transactions = [];
                    const activites = await fetch(`https://gmgn.ai/vas/api/v1/token_trades/monad/${tokenAddress}?device_id=${device_id}&fp_did=${fp_did}&client_id=${client_id}&from_app=${from_app}&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=${app_lang}&os=web&limit=1&maker=&revert=true`);

                    const activitesData = await activites.json();

                    dev_transactions = [...dev_transactions, ...activitesData.data.history];

                    const dev_txs = dev_transactions
                    if (dev_txs.length > 0) {
                        const lastDevTx = dev_txs[0];
                        if (created_block_time == 0) {
                            created_block_time = lastDevTx.timestamp
                        } else if (created_block_time > lastDevTx.timestamp) {
                            migration_block_time = created_block_time
                            created_block_time = lastDevTx.timestamp
                        }
                    }
                } catch(e) {
                    console.log(e)
                }

                const mc_info = await fetch(`
https://gmgn.ai/api/v1/token_mcap_candles/monad/${tokenAddress}?device_id=${device_id}&client_id=${client_id}&from_app=gmgn&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=en-US&fp_did=${fp_did}&os=web&resolution=1m&from=${(first_tx_time - first_tx_time % 60) * 1000}&to=${first_tx_time * 1000 + 4 * 3600000}&limit=240`)
                const mc_array = (await mc_info.json()).data?.list || []

                let ath_4h = 0;
                let ath_hold = 0;

                for (let mc of mc_array) {
                    let high = Number(mc.high);
                    if (ath_4h < high) {
                        ath_4h = high
                        ath_4h_block_time = mc.time / 1000
                    }
                    if (ath_hold < high && first_sell_all_time * 1000 >= mc.time) {
                        ath_hold = high
                        ath_hold_block_time = mc.time / 1000
                    }
                }

                if (first_sell_all_time > 0 && first_sell_all_time - first_tx_time < 120) {
                    const hold_mc_info = await fetch(`
https://gmgn.ai/api/v1/token_mcap_candles/monad/${tokenAddress}?device_id=${device_id}&client_id=${client_id}&from_app=gmgn&app_ver=${app_ver}&tz_name=${tz_name}&tz_offset=${tz_offset}&app_lang=en-US&fp_did=${fp_did}&os=web&resolution=1s&from=${first_tx_time * 1000 + 1000}&to=${first_sell_all_time * 1000}&limit=240`)
                    const hold_mc_array = (await hold_mc_info.json()).data?.list || []

                    ath_hold = 0;
                    for (let mc of hold_mc_array) {
                        let high = Number(mc.high);
                        if (ath_hold < high) {
                            ath_hold = high
                            ath_hold_block_time = mc.time / 1000
                        }

                    }
                }


                let launchpad = tokenDetailData.data?.launchpad?.launchpad_platform

                let launchpad_project = tokenDetailData.data?.launchpad?.launchpad

                let platform = launchpad_project

                if (first_tx_time > migration_block_time && migration_block_time > 0) {
                    if (launchpad_project == 'Pump.fun') platform = 'pump-swap'
                    if (launchpad_project == 'meteora_virtual_curve' || launchpad_project == 'Moonshot') platform = "damm"
                    if (launchpad_project == 'ray_launchpad')
                        platform = "cpmm"
                    if (launchpad_project == 'heaven') platform = "heaven-swap"
                    if (launchpad_project == 'fourmeme') platform = "pancake"
                    if (launchpad_project == 'flap') platform = "pancake"
                    if (launchpad_project == 'nadfun') platform = "copricorn"
                } else {
                    if (launchpad == 'bn_fourmeme') platform = "bn_fourmeme"
                }
                
                tokenInfo[tokenAddress] = {
                    dev,
                    launchpad,
                    launchpad_project,
                    platform,
                    status: tokenDetailData.data?.launchpad?.launchpad_status,
                    txs,
                    migration_block_time,
                    created_block_time,
                    first_tx_time,
                    first_sell_all_time,
                    ath_4h,
                    ath_hold,
                    ath_4h_duration: ath_4h_block_time > first_tx_time ? ath_4h_block_time - first_tx_time : 0,
                    ath_hold_duration: ath_hold_block_time > first_tx_time ? ath_hold_block_time - first_tx_time : 0,
                    first_buy_mc,
                    pnl_hold: (ath_hold / first_buy_mc / 10 * 0.98 - 100).toFixed(0),
                    pnl_4h: (ath_4h / first_buy_mc / 10 * 0.98 - 100).toFixed(0),
                    links,
                    token_amount_left,
                    first_buy_amount
                }

                // console.log("tokenInfo", tokenInfo)

                applyFilterToRow(tokenAddress);


            } catch (err) {
                console.log("err", err)
            }
        }, 500)
    }
    function initializeConfiguration() {
        device_id = localStorage.getItem('key_device_id');
        const locale_data = JSON.parse(localStorage.getItem('locale_data'));
        client_id = `gmgn_web_${locale_data.version}`
        from_app = 'gmgn'
        app_ver = locale_data.version
        // get timezone from date
        const date = new Date();
        tz_name = date.toLocaleString('en-US', { timeZone: locale_data.timezone });
        tz_offset = date.getTimezoneOffset()
        app_lang = 'en-US'
        fp_did = localStorage.getItem('key_fp_did')
        os = 'web'
    }

    async function handleNewRow(row) {
        rows.push(row);
        const tokenAddress = row.querySelector('a').href.split('/').pop();
        tokens.push(tokenAddress);

    }

    function startScanning() {
        const tableRows = document.querySelectorAll('div[aria-labelledby="tabs-leftTabs--tab-0"] tbody tr');

        tableRows.forEach(function (row) {
            handleNewRow(row);
        });

    }

    function startTableRowMonitoring() {

        startScanning();
        // Set up MutationObserver to watch for new table rows and table updates
        const observer = new MutationObserver(function (mutations) {
            if (!window.location.href.startsWith("https://gmgn.ai/monad/address")) {
                const dialog = document.getElementsByClassName('gmgn-filter-modal')[0];
                if (dialog) {
                    dialog.classList.remove('gmgn-filter-active');
                }

            }
            mutations.forEach(function (mutation) {
                // Handle modified nodes (updated table content)
                if (mutation.type === 'childList' && mutation.target.nodeType === Node.ELEMENT_NODE) {
                    // Check if the target has the specific class name we're looking for
                    if (mutation.target.classList && mutation.target.classList.contains('g-table-tbody')) {
                        // Process added nodes
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length >= 10) {
                                // Check if the added node is a table row or contains table rows                                
                                handleNewRow(node);
                            }
                        });
                    }
                }
            });

        });

        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });


    }



    function getCurrentFilters() {
        const savedFilters = localStorage.getItem('gmgn-monad-filters');
        if (savedFilters) {
            try {
                return JSON.parse(savedFilters);
            } catch (error) {
                console.error('Error parsing saved filters:', error);
                return null;
            }
        }
        return null;
    }

    function openMultipleBrowser() {
        let cnt = 0;
        if (filtered_tokens.length > 0) {
            while (opened_browsers < filtered_tokens.length) {

                window.open(`https://gmgn.ai/monad/token/${filtered_tokens[opened_browsers]}?tag=All&maker=${wallet}&filter=All`, '_blank');
                opened_browsers++;
                cnt++;
                if (cnt == 7)
                    break;
            }
        }
        else {
            while (opened_browsers < tokens.length) {

                window.open(`https://gmgn.ai/monad/token/${tokens[opened_browsers]}?tag=All&maker=${wallet}&filter=All`, '_blank');
                opened_browsers++;
                cnt++;
                if (cnt == 7)
                    break;
            }
        }
    }

    function createFilterIcon() {
        // Create filter icon button
        //<button type="button" aria-disabled="false" id="tabs-leftTabs--tab-3" role="tab" tabindex="-1" aria-selected="false" aria-controls="tabs-leftTabs--tabpanel-3" class="chakra-tabs__tab css-1enhadl" data-index="3">


        const tablists = document.querySelectorAll('div[role="tablist"]');
        const tabs = tablists[tablists.length - 1];
        const filterIcon = document.createElement('button');

        const multipleBrowser = document.createElement('button');
        multipleBrowser.classList.add('chakra-tabs__tab', 'css-1leqcho');
        multipleBrowser.setAttribute('role', 'tab');
        multipleBrowser.setAttribute('type', 'button');
        multipleBrowser.setAttribute('aria-disabled', 'false');
        multipleBrowser.setAttribute('aria-selected', 'false');
        multipleBrowser.setAttribute('aria-controls', 'tabs-leftTabs--tabpanel-5');
        multipleBrowser.setAttribute('tabindex', '-1');
        multipleBrowser.innerHTML = `Open Charts`;



        filterIcon.classList.add('chakra-tabs__tab', 'css-1leqcho');
        filterIcon.setAttribute('role', 'tab');
        filterIcon.setAttribute('type', 'button');
        filterIcon.setAttribute('aria-disabled', 'false');
        filterIcon.setAttribute('aria-selected', 'false');
        filterIcon.setAttribute('aria-controls', 'tabs-leftTabs--tabpanel-4');
        filterIcon.setAttribute('tabindex', '-1');
        filterIcon.innerHTML = `Filter`;
        filterIcon.style.marginLeft = '8px';

        filterIcon.innerHTML = `Filter`;





        filterIcon.title = 'Open Filter Dialog';

        // Add click event
        filterIcon.addEventListener('click', toggleFilterDialog);

        // Add click event
        multipleBrowser.addEventListener('click', openMultipleBrowser);


        // Insert the icon into the page
        // Try to find a good position - look for header or navigation area


        tabs.appendChild(filterIcon);
        tabs.appendChild(multipleBrowser);
    }

    function createFilterDialog() {
        // Create filter dialog

        const dialog = document.createElement('div');
        dialog.innerHTML = `
            <div class="gmgn-filter-modal">                
                <div class="gmgn-filter-content" id="draggable">        
                    <button class="gmgn-filter-close" id="gmgn-filter-close">&times;</button>        
                    <div class="gmgn-filter-section">                    
                        <div class="gmgn-filter-flex">Platforms: 
                        <div class="gmgn-filter-checkboxes">
                        <label><input type="checkbox" id="gmgn-filter-launchpad" value="launchpad">Only Launchpad </label>
                        </div>
                        </div>
                        </label>
                        <div class="gmgn-filter-checkboxes">
                            <label><input launchpad type="checkbox" value="nadfun">Nad.fun</label>                            
                        </div>
                        <div class="gmgn-filter-checkboxes">
                            <label><input migrated type="checkbox" value="copricorn">Copricorn Exchange</label>                            
                        </div>
                    </div>
                    <div class="gmgn-filter-section gmgn-filter-flex">
                        <label>MC:</label>
                        <div class="gmgn-filter-range">
                            <input type="number" id="first-buy-mc-min" placeholder="Min MC">
                            <span>-</span>
                            <input type="number" id="first-buy-mc-max" placeholder="Max MC">
                        </div>
                    </div>
                    
                    <div class="gmgn-filter-section gmgn-filter-flex">
                        <label>Buy BNB:</label>
                        <div class="gmgn-filter-range">
                            <input type="number" id="first-buy-amount-min" placeholder="Min Amount">
                            <span>-</span>
                            <input type="number" id="first-buy-amount-max" placeholder="Max Amount">
                        </div>
                    </div>
                    
                    <div class="gmgn-filter-section gmgn-filter-flex">
                        <label>Token age:</label>
                        <div class="gmgn-filter-range">
                            <input type="number" id="min-token-age" placeholder="Min Token Age">
                            <span>-</span>
                            <input type="number" id="max-token-age" placeholder="Max Token Age">
                            
                                                        
                        </div>
                    </div>
                    <div class="gmgn-filter-actions">
                        <button id="gmgn-filter-apply">Apply Filters</button>
                        <button id="gmgn-filter-clear">Clear All</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add event listeners
        document.getElementById('gmgn-filter-close').addEventListener('click', toggleFilterDialog);
        // document.getElementById('gmgn-filter-overlay').addEventListener('click', toggleFilterDialog);
        document.getElementById('gmgn-filter-apply').addEventListener('click', applyFilters);
        document.getElementById('gmgn-filter-clear').addEventListener('click', clearFilters);

        document.getElementById('gmgn-filter-launchpad').addEventListener('click', selectLaunchPad);

        const inputs = document.querySelectorAll('.gmgn-filter-range > input');
        console.log("Input Length:", inputs.length)
        for (let input_item of inputs) {
            input_item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    applyFilters();
                }
            });
        }


        // Load saved filters
        loadSavedFilters();
    }

    function selectLaunchPad(e) {
        let isChecked = (e.target.checked)
        const launchpads = document.querySelectorAll("input[launchpad]");
        for (let launchpad of launchpads) {
            launchpad.checked = isChecked
        }
        if (isChecked) {
            const migrated = document.querySelectorAll("input[migrated]");
            for (let migrate of migrated) {
                migrate.checked = !isChecked
            }
        }
    }

    function toggleFilterDialog() {
        const dialog = document.getElementsByClassName('gmgn-filter-modal')[0];
        if (dialog) {
            dialog.classList.toggle('gmgn-filter-active');
        }
    }

    function applyFilters() {
        const filtersData = {
            platforms: Array.from(document.querySelectorAll('.gmgn-filter-checkboxes input:checked'))
                .map(cb => cb.value),
            firstBuyMc: {
                min: document.getElementById('first-buy-mc-min').value,
                max: document.getElementById('first-buy-mc-max').value
            },
            firstBuyAmount: {
                min: document.getElementById('first-buy-amount-min').value,
                max: document.getElementById('first-buy-amount-max').value
            },
            maxTokenAge: document.getElementById('max-token-age').value,
            minTokenAge: document.getElementById('min-token-age').value
        };

        // Save filters to localStorage
        localStorage.setItem('gmgn-monad-filters', JSON.stringify(filtersData));
        console.log('Filters saved to localStorage:', filtersData);

        // Apply filters to the page (you can customize this based on the page structure)
        filters = filtersData

        opened_browsers = 0;
        filtered_tokens = [];

        applyFiltersToPage();


        // Close dialog
        // toggleFilterDialog();
    }

    function clearFilters() {
        // Clear all inputs
        document.querySelectorAll('.gmgn-filter-checkboxes input').forEach(cb => cb.checked = false);
        document.querySelectorAll('.gmgn-filter-range input').forEach(input => input.value = '');

        // Clear localStorage
        localStorage.removeItem('gmgn-monad-filters');

        // Remove any applied filters from the page
        filtered_tokens = [];
        opened_browsers = 0;

        filters = null;

        applyFiltersToPage();
    }

    function loadSavedFilters() {
        const savedFilters = localStorage.getItem('gmgn-monad-filters');
        if (savedFilters) {
            try {
                const filters = JSON.parse(savedFilters);

                // Restore platform checkboxes
                if (filters.platforms) {
                    filters.platforms.forEach(platform => {
                        const checkbox = document.querySelector(`input[value="${platform}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }

                // Restore range inputs
                if (filters.firstBuyMc) {
                    document.getElementById('first-buy-mc-min').value = filters.firstBuyMc.min || '';
                    document.getElementById('first-buy-mc-max').value = filters.firstBuyMc.max || '';
                }

                if (filters.firstBuyAmount) {
                    document.getElementById('first-buy-amount-min').value = filters.firstBuyAmount.min || '';
                    document.getElementById('first-buy-amount-max').value = filters.firstBuyAmount.max || '';
                }

                if (filters.maxTokenAge) {
                    document.getElementById('max-token-age').value = filters.maxTokenAge || '';
                }

                if (filters.maxTokenAge) {
                    document.getElementById('min-token-age').value = filters.minTokenAge || '';
                }


                console.log('Filters loaded from localStorage:', filters);
            } catch (error) {
                console.error('Error parsing saved filters:', error);
                localStorage.removeItem('gmgn-monad-filters');
            }
        }
    }

    function applyFiltersToPage() {
        // This function will apply the filters to the page content
        // You may need to customize this based on the actual structure of gmgn.

        filtered_tokens = [];
        opened_browsers = 0;

        tokens.forEach((token) => {
            applyFilterToRow(token)
        })
    }


    function formatTokenAge(ageInSeconds) {
        const days = Math.floor(ageInSeconds / (24 * 60 * 60));
        const hours = Math.floor((ageInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((ageInSeconds % (60 * 60)) / 60);

        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (ageInSeconds > 60) {
            return `${minutes}m ${ageInSeconds % 60}s`;
        } else return `${ageInSeconds}s`
    }

    function formatATH(value) {
        if (!value || value === 0) return '0';

        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toFixed(2);
        }
    }
    function formatPNL(value) {
        if (!value || value === 0) return '0';

        if (value >= 1000000) {
            return '+' + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return '+' + (value / 1000).toFixed(1) + 'K';
        } else if (value > 0) {
            return '+' + value
        } else return value
    }

    function parseDurationToSeconds(durationText) {
        if (!durationText) return 0;

        // Remove any whitespace and convert to lowercase
        const text = durationText.trim().toLowerCase();

        // Extract number and unit
        const match = text.match(/(\d+(?:\.\d+)?)\s*([dhms])/);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'd': return value * 24 * 60 * 60; // days to seconds
            case 'h': return value * 60 * 60;      // hours to seconds
            case 'm': return value * 60;           // minutes to seconds
            case 's': return value;                // already in seconds
            default: return 0;
        }
    }
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === 'openFilters') {
            toggleFilterDialog();
            sendResponse({ success: true });
        } else if (request.action === 'clearFilters') {
            clearFilters();
            sendResponse({ success: true });
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        const interval = setInterval(() => {
            const tableRows = document.querySelectorAll('div[aria-labelledby="tabs-leftTabs--tab-0"] tbody tr');
            if (tableRows.length > 0) {
                init();
                clearInterval(interval);
            }
        }, 100);
    }




    const style = document.createElement('style');
    style.textContent = `
    td[token_age] {
        position: relative !important;
    }
    
    td[first_buy_mc_added] {
        position: relative !important;
    }

    td[holding_duration_color="red"] > div > div{
        color: #f88 !important;
    }

    td[holding_duration_color="yellow"] div > div{
        color: #ffe609cc !important;
    }

    td[holding_duration_color="green"] {
        color: green !important;
    }
    
    td[ath_info_added] {
        position: relative !important;
        width: 200px;
    }`
    document.head.appendChild(style);


})(); 
