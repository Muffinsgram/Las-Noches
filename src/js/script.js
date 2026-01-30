/* =========================================
   1. DISCORD AYARLARI (BURAYI DÜZENLE)
   ========================================= */
const CLIENT_ID = "1466766670801539117"; // Developer Portal'dan aldığın ID
const REDIRECT_URI = "https://lasnoches.vercel.app/index.html"; // Kendi site adresin (Tam URL)

// Global Kullanıcı Değişkeni
let discordUser = null;

/* =========================================
   2. DISCORD OAUTH FONKSİYONLARI (GLOBAL)
   ========================================= */

// Giriş Yap Butonu Tetikleyicisi
function loginWithDiscord() {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    window.location.href = url;
}

// URL'den Token'ı Yakalama ve Kullanıcı Verisi Çekme
function checkDiscordAuth() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(response => {
            discordUser = response;
            updateUIState(true);
            // URL'i temizle
            history.pushState("", document.title, window.location.pathname + window.location.search);
        })
        .catch(console.error);
    }
}

// Arayüzü Güncelleme (Giriş/Çıkış Durumu)
function updateUIState(isLoggedIn) {
    const loginSections = document.querySelectorAll('#discordLoginSection, #scrimLoginSection');
    const userDisplays = document.querySelectorAll('#discordUserDisplay, #scrimUserDisplay');
    const forms = document.querySelectorAll('#appForm, #scrimForm');
    
    // Avatar ve İsim Elementleri
    const avatars = document.querySelectorAll('#userAvatar, #scrimUserAvatar');
    const names = document.querySelectorAll('#userName, #scrimUserName');
    const idDisplay = document.getElementById('userId');

    if (isLoggedIn && discordUser) {
        // Giriş Yapıldı
        loginSections.forEach(el => el.style.display = 'none');
        
        const avatarUrl = discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` 
            : "https://cdn.discordapp.com/embed/avatars/0.png";

        avatars.forEach(img => img.src = avatarUrl);
        names.forEach(txt => txt.innerText = discordUser.global_name || discordUser.username);
        if(idDisplay) idDisplay.innerText = `@${discordUser.username}`;

        userDisplays.forEach(el => el.style.display = 'flex');
        forms.forEach(el => el.style.display = 'block');
    } else {
        // Çıkış Yapıldı
        loginSections.forEach(el => el.style.display = 'block');
        userDisplays.forEach(el => el.style.display = 'none');
        forms.forEach(el => el.style.display = 'none');
        discordUser = null;
    }
}

// Çıkış Yap Butonu
function logoutDiscord() {
    discordUser = null;
    updateUIState(false);
    alert("Çıkış yapıldı.");
}

// Sekme Değiştirme (Global Kalmalı)
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const selectedTab = document.getElementById(tabName);
    if(selectedTab) {
        selectedTab.style.display = "flex";
        setTimeout(() => selectedTab.classList.add("active"), 10);
    }
    if(evt) evt.currentTarget.className += " active";
}

// Mobil Menü Kapatma (Global)
function closeMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(hamburger) hamburger.classList.remove('active');
    if(mobileMenu) mobileMenu.classList.remove('active');
}

// Mobilden Modal Açma (Global)
function openModalFromMobile() {
    closeMenu();
    const modal = document.getElementById('joinModal');
    if(modal) modal.style.display = 'flex';
}

/* =========================================
   3. DOMContentLoaded (SAYFA YÜKLENİNCE)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // Discord Auth Kontrolü
    checkDiscordAuth();

    // 1. LOADER
    const loader = document.querySelector('.loader-wrapper');
    const body = document.body;
    body.classList.add('no-scroll');

    setTimeout(() => {
        if(loader) loader.classList.add('fade-out');
        body.classList.remove('no-scroll');
    }, 1200);

    // 2. MODAL & MOBİL MENÜ
    const modal = document.getElementById('joinModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if(openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
    if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // 3. SCROLL ANİMASYONU
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show-animate');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden-animate').forEach((el) => observer.observe(el));

    // 4. DISCORD ÜYE SAYACI
    const memberCountEl = document.getElementById('memberCount');
    if(memberCountEl) {
        let count = 0;
        const target = 282; // Hedef üye sayısı
        const speed = 25; // Hız

        const updateCount = () => {
            const inc = target / 100;
            if(count < target) {
                count += inc;
                memberCountEl.innerText = Math.ceil(count);
                setTimeout(updateCount, speed);
            } else {
                memberCountEl.innerText = target;
            }
        };
        
        const discObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    updateCount();
                    discObserver.unobserve(entry.target);
                }
            });
        });
        const section = document.querySelector('.discord-section');
        if(section) discObserver.observe(section);
    }

    // 5. YOUTUBE OTOMASYONU
    const videoTriggers = document.querySelectorAll('.yt-trigger');
    const videoModal = document.getElementById('videoModal');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const closeVideoBtn = document.querySelector('.close-video');

    function getVideoId(input) {
        if (!input) return null;
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
        const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([\w-]{11})/);
        return match ? match[1] : null;
    }

    videoTriggers.forEach(trigger => {
        const rawInput = trigger.getAttribute('data-youtube-id');
        const videoId = getVideoId(rawInput);
        if (videoId) {
            const imgElement = trigger.querySelector('.yt-thumb');
            if (imgElement) imgElement.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            
            trigger.addEventListener('click', () => {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                if(youtubePlayer) youtubePlayer.src = embedUrl;
                if(videoModal) {
                    videoModal.style.display = 'flex';
                    document.body.classList.add('no-scroll');
                }
            });
        }
    });

    function closeVideoModal() {
        if(videoModal) videoModal.style.display = 'none';
        if(youtubePlayer) youtubePlayer.src = ''; 
        document.body.classList.remove('no-scroll');
    }

    if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);
    if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && videoModal && videoModal.style.display === 'flex') closeVideoModal(); });

    // 6. S.S.S. (FAQ) ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            if(item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                faqItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    /* =========================================
       7. BAŞVURU FORMU (JOIN WEBHOOK)
       ========================================= */
    const appForm = document.getElementById('appForm');
    const formContainer = document.getElementById('applicationFormContainer');
    const successMsg = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // WEBHOOK URL
    const JOIN_WEBHOOK_URL = "https://discord.com/api/webhooks/1464544708255547520/CMqGMits99YFybRHyFsZaZukrb3zfeES8axsdYJlBYWSzykIcHCkvx1Cmw6G11w-x3l1"; 
    const DISCORD_ROLE_ID = "1464560068044394558"; 

    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // GÜVENLİK KONTROLÜ
            if (!discordUser) {
                alert("Lütfen önce Discord ile giriş yapın!");
                return;
            }

            const ign = document.getElementById('ign').value;
            // Discord ID ve Tag'i Global Değişkenden alıyoruz
            const discordId = discordUser.id;
            const discordTag = discordUser.username;
            
            const rank = document.getElementById('rank').value;
            const selectedGame = document.querySelector('input[name="game"]:checked').value;

            let gameName, embedColor, gameIcon;
            if (selectedGame === 'cs') {
                gameName = "Counter-Strike 2";
                embedColor = 15105570;
                gameIcon = "https://upload.wikimedia.org/wikipedia/commons/d/df/Counter-Strike_2_logo.png"; 
            } else {
                gameName = "VALORANT";
                embedColor = 16729685;
                gameIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png";
            }
            const bannerImage = "https://wallpapers.com/images/hd/purple-gaming-setup-1920-x-1080-wallpaper-h5h0j5k0j5k0j5k0.jpg";

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GÖNDERİLİYOR...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const payload = {
                username: "Las Noches e-Sport",
                avatar_url: "https://i.imgur.com/AfFp7pu.png",
                content: DISCORD_ROLE_ID ? `<@&${DISCORD_ROLE_ID}> Yeni bir başvuru geldi! 🚨` : "Yeni bir başvuru geldi! 🚨",
                embeds: [
                    {
                        title: `Yeni Katılım İsteği: ${ign}`,
                        description: `**${ign}** adlı oyuncu takıma katılmak için başvuru formunu doldurdu. Detaylar aşağıdadır.`,
                        color: embedColor,
                        thumbnail: { url: gameIcon },
                        image: { url: bannerImage },
                        fields: [
                            { name: "🎮 Oyun", value: `\`\`\`${gameName}\`\`\``, inline: true },
                            { name: "🏆 Rank / Rütbe", value: `\`\`\`${rank}\`\`\``, inline: true },
                            { 
                                name: "💬 Discord Kullanıcısı", 
                                value: `**${discordTag}**\n<@${discordId}>`, // Güncellenen kısım
                                inline: false 
                            },
                            { name: "📅 Başvuru Tarihi", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                        ],
                        footer: { text: "Las Noches Esports • Resmi Başvuru Sistemi", icon_url: "https://i.imgur.com/AfFp7pu.png" }
                    }
                ]
            };

            fetch(JOIN_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    formContainer.style.display = 'none';
                    successMsg.style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('joinModal').style.display = 'none';
                        setTimeout(() => {
                            appForm.reset();
                            formContainer.style.display = 'block';
                            successMsg.style.display = 'none';
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.style.opacity = '1';
                            submitBtn.disabled = false;
                        }, 500);
                        document.body.classList.remove('no-scroll');
                    }, 3000);
                } else {
                    alert("Discord bağlantı hatası!");
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error(error);
                alert("Bir hata oluştu.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // 8. SCROLL TO TOP
    const scrollTopBtn = document.getElementById('scrollToTop');
    if(scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
            else scrollTopBtn.classList.remove('visible');
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 9. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if(cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });
        const clickables = document.querySelectorAll('a, button, .pro-card, .news-card, .featured-video, .clip-item, .faq-question');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }

    // 10. CROSSHAIR KOPYALAMA
    const crosshairBtns = document.querySelectorAll('.copy-crosshair-btn');
    crosshairBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i> KOPYALANDI!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalText;
                }, 2000);
            }).catch(err => alert("Kopyalama başarısız oldu."));
        });
    });

    // 11. SAYFA BAŞLIĞI (AFK MODU)
    let docTitle = document.title;
    window.addEventListener("blur", () => document.title = "AFK mısın? 👀 | LAS NOCHES");
    window.addEventListener("focus", () => document.title = docTitle);

    // 12. SCRIM MODAL & FORM
    const scrimModal = document.getElementById('scrimModal');
    const openScrimBtn = document.getElementById('openScrimBtn');
    const closeScrimBtn = document.querySelector('.close-scrim');

    if(openScrimBtn) openScrimBtn.addEventListener('click', () => scrimModal.style.display = 'flex');
    if(closeScrimBtn) closeScrimBtn.addEventListener('click', () => scrimModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == scrimModal) scrimModal.style.display = 'none';
    });

    const scrimForm = document.getElementById('scrimForm');
    const scrimContainer = document.getElementById('scrimFormContainer');
    const scrimSuccess = document.getElementById('scrimSuccessMsg');
    const scrimBtn = document.getElementById('scrimSubmitBtn');
    
    // SCRIM WEBHOOK URL
    const SCRIM_WEBHOOK_URL = "https://discord.com/api/webhooks/1465082632717992027/tFlQmkjvzu1gZ9Ud9pXqcQPvVNmTbSYsesapAmFlpKj2vzl37NLswzIZRVgsfJJEefp0"; 

    if (scrimForm) {
        scrimForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // GÜVENLİK KONTROLÜ
            if (!discordUser) {
                alert("Scrim isteği göndermek için Discord ile giriş yapmalısın!");
                return;
            }

            const teamName = document.getElementById('teamName').value;
            // Discord ID Globalden alınıyor
            const contact = discordUser.id; 
            
            const date = document.getElementById('scrimDate').value;
            const map = document.getElementById('mapPref').value || "Farketmez";
            const sGame = document.querySelector('input[name="scrimGame"]:checked').value;
            
            let gameLabel = sGame === 'cs' ? 'Counter-Strike 2' : 'VALORANT';
            let colorCode = sGame === 'cs' ? 15105570 : 16729685; 

            const orgBtnText = scrimBtn.innerHTML;
            scrimBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GÖNDERİLİYOR...';
            scrimBtn.style.opacity = '0.7';
            scrimBtn.disabled = true;

            const payload = {
                username: "Las Noches Scrim Bot",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/1691/1691983.png", 
                content: "Muffinsgram feci",
                embeds: [
                    {
                        title: `Scrim İsteği: ${teamName}`,
                        description: "**Las Noches** ile antrenman maçı yapmak istiyorlar.",
                        color: colorCode,
                        fields: [
                            { name: "🎮 Oyun", value: `\`${gameLabel}\``, inline: true },
                            { name: "📅 Tarih & Saat", value: `\`${date}\``, inline: true },
                            { name: "🗺️ Harita", value: `\`${map}\``, inline: true },
                            { 
                                name: "📞 İletişim (Kaptan)", 
                                value: `**<@${contact}>**`, // Etiketleme
                                inline: false 
                            }
                        ],
                        footer: { text: "Las Noches • Scrim Sistemi" },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            fetch(SCRIM_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if(res.ok) {
                    scrimContainer.style.display = 'none';
                    scrimSuccess.style.display = 'block';
                    setTimeout(() => {
                        scrimModal.style.display = 'none';
                        setTimeout(() => {
                            scrimForm.reset();
                            scrimContainer.style.display = 'block';
                            scrimSuccess.style.display = 'none';
                            scrimBtn.innerHTML = orgBtnText;
                            scrimBtn.style.opacity = '1';
                            scrimBtn.disabled = false;
                        }, 500);
                    }, 3000);
                } else {
                    alert("Hata oluştu.");
                    scrimBtn.innerHTML = orgBtnText;
                    scrimBtn.disabled = false;
                }
            })
            .catch(err => {
                console.error(err);
                alert("Bağlantı hatası.");
                scrimBtn.innerHTML = orgBtnText;
                scrimBtn.disabled = false;
            });
        });
    }

    // 13. PROGRESS BAR
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("progressBar").style.width = scrolled + "%";
    });

    // 14. TYPEWRITER EFFECT
    const typeText = "Taktiksel zeka ve keskin aim'in buluşma noktası. Las Noches arenaya hükmediyor.";
    const typeElement = document.getElementById('typewriter');
    
    if (typeElement) {
        let i = 0;
        function typeWriter() {
            if (i < typeText.length) {
                typeElement.innerHTML += typeText.charAt(i);
                i++;
                setTimeout(typeWriter, 50); 
            } else {
                typeElement.innerHTML += '<span class="cursor-blink"></span>';
            }
        }
        setTimeout(typeWriter, 1500); 
    }
});


// =========================================
    // 15. HABERLER MODALI (NEWS POP-UP) - EKLENECEK KISIM
    // =========================================
    const newsModal = document.getElementById('newsModal');
    const newsBtns = document.querySelectorAll('.read-more-btn');
    const closeNewsBtn = document.querySelector('.close-news');

    // Modal İçerik Elementleri
    const modalImg = document.getElementById('modalNewsImg');
    const modalDate = document.getElementById('modalNewsDate');
    const modalTitle = document.getElementById('modalNewsTitle');
    const modalText = document.getElementById('modalNewsText');

    if (newsBtns) {
        newsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Butondaki verileri al
                const title = btn.getAttribute('data-title');
                const img = btn.getAttribute('data-img');
                const date = btn.getAttribute('data-date');
                const text = btn.getAttribute('data-text');

                // 2. Modalı doldur
                modalTitle.innerText = title;
                modalImg.src = img;
                modalDate.innerText = date;
                modalText.innerText = text;

                // 3. Modalı aç
                newsModal.style.display = 'flex';
                document.body.classList.add('no-scroll'); // Arkadaki kaydırmayı kilitle
            });
        });
    }

    // Kapatma Fonksiyonu
    function closeNews() {
        newsModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    if (closeNewsBtn) closeNewsBtn.addEventListener('click', closeNews);
    
    // Boşluğa tıklayınca kapat
    window.addEventListener('click', (e) => {
        if (e.target == newsModal) closeNews();
    });
