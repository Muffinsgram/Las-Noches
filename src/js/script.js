document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LOADER
    const loader = document.querySelector('.loader-wrapper');
    const body = document.body;
    body.classList.add('no-scroll');

    setTimeout(() => {
        loader.classList.add('fade-out');
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


// ... Geri sayım kodları bittikten sonra ...

    // 6. DISCORD ÜYE SAYACI
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
        
        // Bu animasyonu kullanıcı Discord bölümüne gelince başlat (Observer ile)
        const discObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    updateCount();
                    discObserver.unobserve(entry.target); // Sadece bir kere çalışsın
                }
            });
        });
        
        discObserver.observe(document.querySelector('.discord-section'));
    }



    // 5. YOUTUBE OTOMASYONU (AKILLI SİSTEM)
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
                youtubePlayer.src = embedUrl;
                videoModal.style.display = 'flex';
                document.body.classList.add('no-scroll');
            });
        }
    });

    function closeVideoModal() {
        videoModal.style.display = 'none';
        youtubePlayer.src = ''; 
        document.body.classList.remove('no-scroll');
    }

    if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);
    if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && videoModal.style.display === 'flex') closeVideoModal(); });
});

// GLOBAL FONKSİYONLAR
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

function closeMenu() {
    document.getElementById('hamburgerBtn').classList.remove('active');
    document.getElementById('mobileMenu').classList.remove('active');
}

function openModalFromMobile() {
    closeMenu();
    document.getElementById('joinModal').style.display = 'flex';
}

// ... Mevcut kodların en altı ...

    // --- S.S.S. (FAQ) ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Tıklanan zaten açıksa kapat
            if(item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // Değilse, önce diğer açık olanları kapat (İsteğe bağlı)
                faqItems.forEach(i => i.classList.remove('active'));
                // Sonra tıklananı aç
                item.classList.add('active');
            }
        });
    });


    // --- BAŞVURU FORMU (PRO DISCORD EMBED) ---
    const appForm = document.getElementById('appForm');
    const formContainer = document.getElementById('applicationFormContainer');
    const successMsg = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // 1. BURAYI DOLDUR: Webhook URL'ni yapıştır
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1464544708255547520/CMqGMits99YFybRHyFsZaZukrb3zfeES8axsdYJlBYWSzykIcHCkvx1Cmw6G11w-x3l1"; 
    
    // 2. BURAYI DOLDUR: Bildirim gidecek Rolün ID'si (Opsiyonel, boş bırakırsan etiketlemez)
    // Örnek: "987654321098765432"
    const DISCORD_ROLE_ID = "1464560068044394558"; 

    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form Verilerini Al
            const ign = document.getElementById('ign').value;
            const discordId = document.getElementById('discord').value;
            const rank = document.getElementById('rank').value;
            const selectedGame = document.querySelector('input[name="game"]:checked').value;

            // Oyun Bazlı Ayarlar (Renk ve Resim)
            let gameName, embedColor, gameIcon, footerIcon;

            if (selectedGame === 'cs') {
                gameName = "Counter-Strike 2";
                embedColor = 15105570; // Turuncu
                // CS2 Logosu
                gameIcon = "https://upload.wikimedia.org/wikipedia/commons/d/df/Counter-Strike_2_logo.png"; 
            } else {
                gameName = "VALORANT";
                embedColor = 16729685; // Kırmızı
                // Valorant Logosu
                gameIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png";
            }

            // Sitenin Banner Resmi (Embed'in altına şık durur)
            // Eğer senin yüklediğin banner internette yüklü değilse, buraya imgur vb. linki koymalısın.
            // Şimdilik şık bir "Gaming Setup" resmi koyuyorum, sen kendi banner linkini koyabilirsin.
            const bannerImage = "https://wallpapers.com/images/hd/purple-gaming-setup-1920-x-1080-wallpaper-h5h0j5k0j5k0j5k0.jpg";

            // Butonu Yükleniyor Yap
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GÖNDERİLİYOR...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            // --- PRO EMBED TASARIMI ---
            const payload = {
                username: "Las Noches Recruiter",
                avatar_url: "https://i.imgur.com/AfFp7pu.png", // Botun Profil Resmi
                
                // Rol Etiketleme Kısmı (content embed'in dışındadır)
                content: DISCORD_ROLE_ID ? `<@&${DISCORD_ROLE_ID}> Yeni bir başvuru geldi! 🚨` : "Yeni bir başvuru geldi! 🚨",

                embeds: [
                    {
                        title: `🛡️ Yeni Katılım İsteği: ${ign}`,
                        description: `**${ign}** adlı oyuncu takıma katılmak için başvuru formunu doldurdu. Detaylar aşağıdadır.`,
                        color: embedColor,
                        
                        // Sağ üstteki küçük resim (Oyuna göre değişir)
                        thumbnail: {
                            url: gameIcon 
                        },

                        // Büyük Resim (En altta banner)
                        image: {
                            url: bannerImage
                        },

                        // Bilgi Kutucukları
                        fields: [
                            {
                                name: "🎮 Oyun",
                                value: `\`\`\`${gameName}\`\`\``, // Kod bloğu içinde şık görünür
                                inline: true
                            },
                            {
                                name: "🏆 Rank / Rütbe",
                                value: `\`\`\`${rank}\`\`\``,
                                inline: true
                            },
                            {
                                name: "💬 Discord Kullanıcısı",
                                value: `**<@${discordId}>**`, // Kalın yazı
                                inline: false
                            },
                            {
                                name: "📅 Başvuru Tarihi",
                                value: `<t:${Math.floor(Date.now() / 1000)}:F>`, // Discord'un kendi tarih formatı (Dinamik)
                                inline: false
                            }
                        ],

                        footer: {
                            text: "Las Noches Esports • Resmi Başvuru Sistemi",
                            icon_url: "https://i.imgur.com/AfFp7pu.png"
                        }
                    }
                ]
            };

            // Gönderim İşlemi
            fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    // Başarılı Animasyonu
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
                    alert("Discord bağlantı hatası! Lütfen yetkiliye bildir.");
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