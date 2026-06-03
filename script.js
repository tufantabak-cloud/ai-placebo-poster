// ============================================================
// iOS SAFARI SCROLL LOCK FIX
// position:fixed + touchmove engelleme yöntemi
// ============================================================

// iOS tespiti — navigator.platform deprecated, çift kontrol:
const _isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
               (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

let _iosScrollY = 0;
let _lockCount  = 0; // iç içe açılan modaller için referans sayacı

// Modal içindeki scroll'a izin ver, arka planı kilitle
function _onTouchMove(e) {
    // Scroll'u olan bir elemanın içindeyse geçir
    let el = e.target;
    while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') &&
                          el.scrollHeight > el.clientHeight;
        if (canScroll) return; // modal scroll alanı — geçir
        el = el.parentElement;
    }
    e.preventDefault(); // arka plan scroll'unu engelle
}

function lockBodyScroll() {
    _lockCount++;
    if (_lockCount > 1) return; // zaten kilitli

    if (_isIOS) {
        _iosScrollY = window.pageYOffset;
        document.body.style.position   = 'fixed';
        document.body.style.top        = `-${_iosScrollY}px`;
        document.body.style.width      = '100%';
        document.body.style.overflowY  = 'scroll'; // kaydırma çubuğu genişlik kaymasını önler
        // touchmove dinleyici — passive:false şart (preventDefault için)
        document.addEventListener('touchmove', _onTouchMove, { passive: false });
    }
    document.body.classList.add('no-scroll');
}

function unlockBodyScroll() {
    if (_lockCount <= 0) return;
    _lockCount--;
    if (_lockCount > 0) return; // başka modal hâlâ açık

    document.body.classList.remove('no-scroll');
    if (_isIOS) {
        document.removeEventListener('touchmove', _onTouchMove, { passive: false });
        document.body.style.position  = '';
        document.body.style.top       = '';
        document.body.style.width     = '';
        document.body.style.overflowY = '';
        // Kaydırma pozisyonunu geri yükle
        window.scrollTo({ top: _iosScrollY, behavior: 'instant' });
    }
}

// Chart Configuration and Initialization
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#a0a5b0';
    Chart.defaults.font.family = "'Inter', sans-serif";
}
const accentColor = '#1DB954';
let expAudio = null; // Declared globally to avoid Temporal Dead Zone issues
let heroChart = null; // Declared globally to allow dynamic updates on language switch
let genreChart = null; // Declared globally to allow dynamic updates on language switch
let hboChart = null; // Declared globally to allow dynamic updates on language switch


// ============================================================
// I18N - TRANSLATIONS
// ============================================================
const translations = {

    'a-materials-intro': { en: "This section explains the logic behind the fNIRS preprocessing and analysis choices. It is included for transparency and methodological clarity; no analysis scripts are provided on this website. The fNIRS results remain exploratory.", tr: "Bu bölüm, fNIRS ön işleme ve analiz seçimlerinin ardındaki mantığı açıklamaktadır. Şeffaflık ve metodolojik açıklık sağlamak amacıyla eklenmiştir; bu web sitesinde hiçbir analiz kodu paylaşılmamaktadır. fNIRS sonuçları keşfedici niteliğini korumaktadır." },
    'a-materials-qa1-t': { en: "A. What was analyzed?", tr: "A. Ne analiz edildi?" },
    'a-materials-qa1-a': { en: "Raw fNIRS exports were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). The primary neural summary focused on HbO2 Peak in Right and Left PFC ROIs because HbO is commonly used in task-based fNIRS and often shows stronger task-related response amplitude.", tr: "Ham fNIRS çıktıları oksijenli ve deoksijenli hemoglobin sinyalleri (HbO/HbO2 ve HbR/Deoxy) için incelenmiştir. Birincil sinirsel özet, Sağ ve Sol PFC ROI'lerindeki HbO2 Zirvesine odaklanmıştır; çünkü HbO, göreve dayalı fNIRS araştırmalarında yaygın olarak kullanılır ve genellikle göreve bağlı olarak daha güçlü bir yanıt genliği gösterir." },
    'a-materials-qa2-t': { en: "B. How was the signal cleaned?", tr: "B. Sinyal nasıl temizlendi?" },
    'a-materials-qa2-a': { en: "Signals were filtered using a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to reduce slow drift and higher-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations.", tr: "Sinyaller, göreve bağlı hemodinamik dalgalanmaları korurken, yavaş sapmaları ve yüksek frekanslı fizyolojik/enstrümantal gürültüyü azaltmak için 0.01 ila 0.2 Hz aralığında 4. dereceden sıfır fazlı Butterworth bant geçiren filtre kullanılarak filtrelenmiştir." },
    'a-materials-qa3-t': { en: "C. How was baseline handled?", tr: "C. Temel çizgi (baseline) nasıl ele alındı?" },
    'a-materials-qa3-a': { en: "A local trial-level baseline was defined as the −10 to 0 s interval before label reveal. This local pre-label baseline captures the participant’s hemodynamic state immediately before the source attribution appears and helps control trial-to-trial drift.", tr: "Deneme bazında yerel bir temel çizgi, etiket gösterilmeden önceki -10 ila 0 saniye aralığı olarak tanımlanmıştır. Bu yerel etiket öncesi temel çizgi, kaynak atfı görünmeden hemen önceki katılımcının hemodinamik durumunu yakalar ve denemeden denemeye sapmaları kontrol etmeye yardımcı olur." },
    'a-materials-qa4-t': { en: "D. How was the response quantified?", tr: "D. Yanıt nasıl sayısallaştırıldı?" },
    'a-materials-qa4-a': { en: "After label reveal, HbO2 Peak was extracted from a literature-informed post-label HRF response window for each trial and ROI. The analysis focused on Right PFC and Left PFC to test whether the AI-label pattern was right-lateralized.", tr: "Etiket gösterildikten sonra, her deneme ve ROI için literatüre dayalı etiket sonrası HRF yanıt penceresinden HbO2 Zirvesi elde edilmiştir. Analiz, YZ etiketi kalıbının sağ tarafa lateralize olup olmadığını test etmek için Sağ PFC ve Sol PFC'ye odaklanmıştır." },
    'a-materials-qa5-t': { en: "E. How were conditions compared?", tr: "E. Koşullar nasıl karşılaştırıldı?" },
    'a-materials-qa5-a': { en: "For each participant, AI-labeled and Human-labeled trials were averaged separately. AI − Human difference scores were tested at the participant level. The printed poster additionally reports a secondary trial-level LME sensitivity model with participant as a random intercept.", tr: "Her bir katılımcı için, YZ etiketli ve İnsan etiketli denemeler ayrı ayrı ortalanmıştır. YZ - İnsan fark puanları katılımcı düzeyinde test edilmiştir. Basılı poster ek olarak katılımcının rastgele kesişim olduğu deneme düzeyinde ikinci bir LME duyarlılık modeli rapor etmektedir." },
    'a-materials-qa6-t': { en: "F. Why is this exploratory?", tr: "F. Bu neden keşfedici?" },
    'a-materials-qa6-a': { en: "The retained fNIRS sample was small (n = 13) and participant/channel exclusion was substantial. Therefore, fNIRS findings are interpreted as preliminary neural evidence and require replication. Behavioral findings from the full N = 30 sample are the stronger evidence in this thesis.", tr: "Analize dahil edilen fNIRS örneklemi küçüktü (n = 13) ve katılımcı/kanal elemesi önemli boyuttaydı. Bu nedenle, fNIRS bulguları ön sinirsel kanıt olarak yorumlanmıştır ve tekrarlanması gerekmektedir. N = 30'luk tam örneklemden elde edilen davranışsal bulgular bu tezdeki daha güçlü kanıtlardır." },
    'exp-disclaimer': { en: "Your result is based only on your ratings in this demo. It does not measure your brain activity.", tr: "Sonucunuz sadece bu demodaki puanlamalarınıza dayanmaktadır. Beyin aktivitenizi ölçmez." },
    'genre-ara-desc': { en: 'Emotional Intensity', tr: 'Duygusal Yoğunluk' },
    'genre-blues-desc': { en: 'Melodic Aesthetics', tr: 'Melodik Estetik' },
    'genre-elec-desc': { en: 'Technological Structure', tr: 'Teknolojik Yapı' },
    'genre-ara-name': { en: 'Arabesque', tr: 'Arabesk' },
    'genre-blues-name': { en: 'Blues', tr: 'Blues' },
    'genre-elec-name': { en: 'Electronic', tr: 'Elektronik' },
    'audio-playing': { en: 'Playing...', tr: 'Oynatılıyor...' },
    'v-dash-5': { en: 'Curious for the details? <br>', tr: 'Detayları mı merak ediyorsunuz? <br>' },
    'btn-view-title': { en: 'View interactive results dashboard', tr: 'İnteraktif sonuç panelini görüntüle' },
    'btn-view-disabled-title': { en: 'Results dashboard will be active after thesis submission — June 2026', tr: 'Sonuç paneli tez tesliminden sonra aktif olacaktır — Haziran 2026' },
    'btn-close-title': { en: 'Close', tr: 'Kapat' },
    'dash-title': { en: 'Interactive Results Dashboard', tr: 'İnteraktif Sonuç Paneli' },
    'dash-card-1-title': { en: 'Genre-Label Interaction', tr: 'Tür-Etiket Etkileşimi' },
    'dash-card-1-desc': { en: 'Emotional Investment / Trust rating by genre and attribution label.', tr: 'Müzik türü ve kaynak atıf etiketine göre Duygusal Yatırım / Güven değerlendirmesi.' },
    'dash-card-2-title': { en: 'Prefrontal Hemodynamic Dynamics', tr: 'Prefrontal Hemodinamik Dinamikler' },
    'dash-card-2-desc': { en: 'Illustrative Right PFC HbO2 Response Pattern<br><span class="u-fs-1">Schematic visualization based on observed condition-level peak HbO2 differences.</span>', tr: 'Örnekleyici Sağ PFC HbO2 Yanıt Paterni<br><span class="u-fs-1">Gözlemlenen koşul bazlı zirve HbO2 farklılıklarına dayalı şematik görselleştirme.</span>' },

    'a-method-title': { en: 'Method', tr: 'Metot' },
    'a-results-title': { en: 'Neural Results', tr: 'Sinirsel Sonuçlar' },
    'a-discussion-title': { en: 'Discussion', tr: 'Tartışma' },
    'a-references-title': { en: 'References', tr: 'Referanslar' },
    'a-explore-title': { en: 'Exploratory Findings', tr: 'Keşfedici Bulgular' },
    'a-limits-title': { en: 'Limitations', tr: 'Sınırlılıklar' },
    
    'a-panel-1': { en: 'Panel 1: Data vs Sample', tr: 'Panel 1: Veri ve Örneklem' },
    'a-panel-1-desc': { en: 'Your Authenticity AI Penalty (Human - AI):', tr: 'Sizin Otantiklik YZ Cezanız (İnsan - YZ):' },
    'a-panel-1-mean': { en: 'Study Sample Mean:', tr: 'Çalışma Örneklem Ortalaması:' },
    
    'a-panel-2': { en: 'Panel 2: Hypothesis Check', tr: 'Panel 2: Hipotez Kontrolü' },
    'a-h2': { en: 'H2: Auth (Human > AI)', tr: 'H2: Otantiklik (İnsan > YZ)' },
    'a-h6': { en: 'H6: Arabesque Penalty Max', tr: 'H6: Arabesk Cezası Maksimum' },
    'a-h7': { en: 'H7: Elec Trust Reversal', tr: 'H7: Elektronik Güven Tersinmesi' },
    
    'a-panel-3': { en: 'Panel 3: Session Means', tr: 'Panel 3: Oturum Ortalamaları' },
    'a-tbl-label': { en: 'Label', tr: 'Etiket' },
    'a-tbl-auth': { en: 'Auth', tr: 'Otan.' },
    'a-tbl-ei': { en: 'EI', tr: 'Duy. Yat.' },
    'a-tbl-trust': { en: 'Trust', tr: 'Güven' },
    'a-tbl-qual': { en: 'Qual', tr: 'Kalite' },


    'v-b1-title': { en: 'Can you trust your ears? 🎧', tr: 'Kulaklarına güvenebilir misin? 🎧' },
    'v-b1-sub': { en: 'We tested 30 people to find out: does knowing a song was made by AI change how it feels?', tr: 'Bir şarkının yapay zeka tarafından yapıldığını bilmek hislerimizi değiştirir mi? 30 kişiyi test ettik.' },
    'v-b1-desc': { en: 'Imagine someone plays you a beautiful song. They tell you it was written by AI. Do you feel differently than if they had said \'a human made this\'? It turns out — yes, dramatically. And we can see it happening in your brain.', tr: 'Birinin sana güzel bir şarkı çaldığını hayal et. Bunun yapay zeka tarafından yazıldığını söylüyorlar. \'Bunu bir insan yaptı\' demelerinden farklı hisseder misin? Görünüşe göre — evet, hem de çok. Ve bunun beyninde gerçekleştiğini görebiliyoruz.' },
    'v-b1-btn': { en: '🎧 Try the experiment yourself', tr: '🎧 Deneyi kendin yaşa' },

    'v-b2-title': { en: 'What We Wondered', tr: 'Neyi Merak Ettik?' },
    'v-b2-q1': { en: '1. Does the label trick us?', tr: '1. Etiket bizi kandırıyor mu?' },
    'v-b2-a1': { en: 'We wondered: if we tell people a song is \'AI-made\' or \'Human-made\' — but it\'s actually the same song — would they rate it differently? Spoiler: yes.', tr: 'Aynı şarkı için \'Yapay Zeka yapımı\' veya \'İnsan yapımı\' dersek, insanlar farklı puan verir mi? Sürpriz: Evet.' },
    'v-b2-q2': { en: '2. Does it depend on the music?', tr: '2. Müziğin türüne bağlı mı?' },
    'v-b2-a2': { en: 'Turkish Arabesque feels emotional. Electronic music feels modern. Maybe people forgive AI for making Electronic but not Arabesque? We were right.', tr: 'Arabesk duygusaldır. Elektronik müzik moderndir. Belki de insanlar Elektronik müzik için yapay zekayı affeder ama Arabesk için affetmez? Haklıydık.' },
    'v-b2-q3': { en: '3. Can we see it in the brain?', tr: '3. Bunu beyinde görebilir miyiz?' },
    'v-b2-a3': { en: 'We used a special light-based brain scanner to watch what happens when people see the word \'AI\'. The fNIRS pattern suggests possible right-prefrontal source-evaluation demand, like it\'s saying \'wait, is this real?\'', tr: '\'Yapay Zeka\' kelimesini gördüklerinde ne olduğunu izlemek için özel bir beyin tarayıcı kullandık. Beyin daha fazla çalışıyor, adeta \'bekle, bu gerçek mi?\' diyor.' },

    'v-b3-title': { en: 'What We Found', tr: 'Ne Bulduk?' },
    'v-b3-1': { en: '🎵 People don\'t dislike AI music', tr: '🎵 İnsanlar YZ müziğinden nefret etmiyor' },
    'v-b3-1d': { en: 'Listeners enjoyed AI-labeled music just as much. But they said it felt less \'authentic\' and \'soulful\' — even though the displayed source label was manipulated independently of the track\'s actual producer. The label changes what we believe, not what we feel.', tr: 'Dinleyiciler YZ etiketli müzikten de keyif aldı. Ancak, görüntülenen kaynak etiketi parçanın gerçek üreticisinden bağımsız olarak manipüle edilmiş olmasına rağmen daha az \'otantik\' ve \'ruhsuz\' hissettirdiğini söylediler. Etiket hislerimizi değil, inançlarımızı değiştiriyor.' },
    'v-b3-2': { en: '🇹🇷 Arabesque protects itself', tr: '🇹🇷 Arabesk kendini koruyor' },
    'v-b3-2d': { en: 'When we slapped an \'AI\' label on Arabesque, people punished it hardest. It feels like a betrayal of something cultural and human.', tr: 'Arabesk\'e \'YZ\' etiketi yapıştırdığımızda, insanlar onu en sert şekilde cezalandırdı. Kültürel ve insani bir şeye ihanet edilmiş gibi hissettiriyor.' },
    'v-b3-3': { en: '🤖 Electronic music does the opposite', tr: '🤖 Elektronik müzik tam tersini yapıyor' },
    'v-b3-3d': { en: 'In Electronic music, the \'AI\' label actually INCREASED trust. People expected AI to make electronic music, so it made sense.', tr: 'Elektronik müzikte \'YZ\' etiketi güveni ARTIRDI. İnsanlar yapay zekanın elektronik müzik yapmasını bekliyordu, bu yüzden mantıklı geldi.' },
    'v-b3-4': { en: '🧠 AI labels can change how people evaluate music.', tr: '🧠 Ön fNIRS örüntüsü' },
    'v-b3-4d': { en: 'The moment you see the \'AI\' word, the right side of your prefrontal cortex showed a higher HbO2 response pattern — like you\'re switching into critical-thinking mode.', tr: '\'YZ\' kelimesini gördüğünüz an, YZ etiketli denemelerde sağ PFC HbO2 seviyesinin daha yüksek olduğu gözlemlenmiştir. Bu keşfedici bir bulgudur.' },
    'v-b3-5': { en: '🎭 The label is powerful', tr: '🎭 Etiket güçlüdür' },
    'v-b3-5d': { en: 'Across all genres, the source label was the biggest factor in how people rated the music. The actual quality of the music almost didn\'t matter.', tr: 'Tüm türlerde, kaynak etiketi insanların müziği nasıl değerlendirdiğindeki en büyük faktördü. Gerçek üretici ve tür kontrol edildiğinde bile, kaynak etiketleri üst düzey değerlendirmeleri güçlü bir şekilde şekillendirdi.' },

    'v-b4-title': { en: 'How We Did It', tr: 'Bunu Nasıl Yaptık?' },
    'v-b4-1': { en: 'We invited 30 university students to wear a special headband', tr: '30 üniversite öğrencisini özel bir beyin bandı takmaya davet ettik' },
    'v-b4-2': { en: 'They listened to 12 short songs (Arabesque, Blues, Electronic)', tr: '12 kısa şarkı (Arabesk, Blues, Elektronik) dinlediler' },
    'v-b4-3': { en: 'Each song got labeled "AI-Made" or "Human-Made" — sometimes truthfully, sometimes lying!', tr: 'Her şarkıya "YZ-Yapımı" veya "İnsan-Yapımı" etiketi verildi — bazen doğru, bazen yalan söyleyerek!' },
    'v-b4-4': { en: 'They rated each song on feelings: how authentic, trustworthy, and good', tr: 'Her şarkıyı duygularına göre değerlendirdiler: ne kadar otantik, güvenilir ve iyi' },
    'v-b4-5': { en: 'The headband used safe light beams to watch their brains while they decided', tr: 'Kafa bandı, onlar karar verirken beyinlerini izlemek için güvenli ışık huzmeleri kullandı' },

    'v-b6-title': { en: 'Why This Matters', tr: 'Bu Neden Önemli?' },
    'v-b6-1': { en: '🎶 Music platforms have a problem:', tr: '🎶 Müzik platformlarının bir sorunu var:' },
    'v-b6-1d': { en: 'Spotify, Apple Music, and others are filling up with AI-made music. When they start telling you (because of new laws), your favorite songs might suddenly feel different — even though they sound the same.', tr: 'Spotify, Apple Music ve diğerleri YZ yapımı müzikle doluyor. Size söylemeye başladıklarında (yeni yasalar nedeniyle), aynı ses çıkarsalar bile en sevdiğiniz şarkılar aniden farklı hissettirebilir.' },
    'v-b6-2': { en: '🌍 Your culture shapes what you trust:', tr: '🌍 Kültürünüz neye güvendiğinizi şekillendirir:' },
    'v-b6-2d': { en: "The 'AI' label hurts more when it touches music tied to who you are. This isn't just about music — it's about anything cultural: art, writing, food, traditions.", tr: "'YZ' etiketi, kim olduğunuza bağlı müziğe dokunduğunda daha çok acıtır. Bu sadece müzikle ilgili değil — kültürel olan her şeyle ilgili: sanat, yazı, yemek, gelenekler." },
    'v-b6-3': { en: '🧬 People may use source labels as a shortcut when evaluating creative work:', tr: '🧬 İnsanlar yaratıcı eserleri değerlendirirken kaynak etiketlerini bir kısayol olarak kullanabilir:' },
    'v-b6-3d': { en: "Without you knowing it, your brain reacts to the word 'AI' before you've even finished forming an opinion. This 'top-down' filtering shapes what you experience.", tr: "Siz farkına varmadan, beyniniz daha bir fikir oluşturmayı bitirmeden 'YZ' kelimesine tepki verir. Bu 'yukarıdan aşağıya' filtreleme ne deneyimlediğinizi şekillendirir." },

    'v-footer-switch': { en: 'Want the full nerd version?', tr: 'Tam akademik makale sürümünü ister misiniz?' },
    'v-footer-btn': { en: '&rarr; Switch to Academic View', tr: '&rarr; Akademik Görünüme Geç' },
    'v-footer-feedback': { en: 'Have feedback or questions? &rarr;', tr: 'Geri bildirim veya sorularınız mı var? &rarr;' },
    'v-footer-email': { en: 'Email BERKE', tr: 'Berke\'ye E-posta Gönder' },

    'v-dash-1': { en: 'You showed an AI penalty of:', tr: 'Göstermiş olduğun YZ cezası:' },
    'v-dash-1d': { en: 'You gave Human-labeled tracks an average of <span id="vis-penalty-num" class="u-clr-fw">...</span> points higher than AI-labeled tracks — even though we lied to you about some of them.', tr: 'İnsan etiketli parçalara, YZ etiketli parçalardan ortalama <span id="vis-penalty-num" class="u-clr-fw">...</span> puan daha yüksek verdin — bazılarında sana yalan söylemiş olsak bile.' },
    'v-dash-2': { en: 'Which type are you?', tr: 'Sen Hangi Tipsin?' },
    'v-dash-3': { en: 'Study sample fNIRS pattern:', tr: 'Çalışma örneklemi fNIRS örüntüsü:' },
    'v-dash-3d': { en: 'When you saw the \'AI\' label, your right prefrontal cortex would have worked harder — in the average participant, by about <strong class="u-text-white">54%</strong>. That\'s the brain saying "wait, let me think about this."', tr: '\'YZ\' etiketini gördüğünde, fNIRS analizi yapılan örneklemde, YZ etiketli denemeler İnsan etiketli denemelere göre daha yüksek Sağ PFC HbO2 zirvesi göstermiştir. Bu bulgu keşfedicidir ve sizin kendi beyin aktivitenizi tahmin etmez.' },
    'v-dash-4': { en: 'Share your result!', tr: 'Sonucunu Paylaş!' },
    'v-dash-btn': { en: '🔗 Copy Link to Share', tr: '🔗 Paylaşmak İçin Kopyala' },
    'v-dash-song': { en: 'Song-by-Song Breakdown', tr: 'Şarkı Şarkı Analiz' },

    'a-abstract-title': { en: 'Abstract', tr: 'Özet' },
    'a-abstract-text': {
        en: 'Generative-AI music systems now match human composers on surface acoustic features, yet listeners systematically devalue music attributed to AI. The neural mechanisms of this attribution bias, and how they interact with culturally rooted musical genres, remain underspecified. The present study combines functional near-infrared spectroscopy (fNIRS) with subjective rating measures to isolate the contribution of source labeling from actual acoustic content. A within-subjects 2 &times; 2 &times; 3 factorial design (N = 30 behavioral, n = 13 fNIRS retained) crossed Label (AI/Human) &times; Producer (AI/Human) &times; Genre (Arabesque/Blues/Electronic). Participants rated 12 musical excerpts on Emotional Investment, Authenticity, Trust, Liking, and Quality (7-point Likert) while prefrontal cortex hemodynamics were recorded. Results revealed a selective AI-attribution penalty: Human-labeled music received higher Authenticity (&eta;&sup2;p = .285), Emotional Investment (&eta;&sup2;p = .276), and Quality (&eta;&sup2;p = .227) ratings, while Liking remained unaffected (p = .270). The label-by-genre interaction was the largest effect for Trust (&eta;&sup2;p = .339), with Arabesque showing the steepest AI penalty (&Delta; = &minus;1.14) and Electronic exhibiting a reversal (&Delta; = +1.32; AI label increased trust). Right prefrontal cortex showed greater hemodynamic response to AI-labeled stimuli (LME &beta; = 0.058, p₁ = .047), with no effect in left PFC. Findings reframe algorithmic aversion as a culturally moderated phenomenon with detectable neural signatures, supporting genre-AI fit expectation accounts.',
        tr: 'Üretken yapay zeka müzik sistemleri günümüzde yüzeysel akustik özellikler açısından insan bestecilerle eşdeğer düzeye ulaşmış olsa da, dinleyiciler yapay zekaya atfedilen müzikleri sistematik olarak daha az değerli bulmaktadır. Bu atıf yanlılığının sinirsel mekanizmaları ve kültürel kökenli müzik türleriyle nasıl etkileşime girdiği henüz tam olarak belirlenmemiştir. Bu çalışma, kaynak etiketlemenin etkisini gerçek akustik içerikten yalıtmak amacıyla fonksiyonel yakın kızılötesi spektroskopisi (fNIRS) ile öznel değerlendirme ölçümlerini birleştirmektedir. Katılımcılar içi 2 &times; 2 &times; 3 faktöriyel desen (N = 30 davranışsal, n = 13 fNIRS analize dahil edilen) kapsamında Etiket (YZ/İnsan) &times; Üretici (YZ/İnsan) &times; Tür (Arabesk/Blues/Elektronik) koşulları çaprazlanmıştır. Katılımcılar prefrontal korteks hemodinamikleri kaydedilirken 12 müzik kesitini Duygusal Yatırım, Otantiklik, Güven, Beğeni ve Kalite (7\'li Likert) boyutlarında değerlendirmiştir. Sonuçlar seçici bir YZ atıf cezası ortaya koymuştur: İnsan etiketli müzikler daha yüksek Otantiklik (&eta;&sup2;p = .285), Duygusal Yatırım (&eta;&sup2;p = .276) ve Kalite (&eta;&sup2;p = .227) puanları alırken, Beğeni düzeyi etkilenmemiştir (p = .270). Etiket ve tür etkileşimi, Güven boyutu için en büyük etkiyi göstermiş (&eta;&sup2;p = .339), Arabesk en keskin YZ cezasını sergilerken (&Delta; = &minus;1.14), Elektronik tersine bir etki ortaya koymuştur (&Delta; = +1.32; YZ etiketi güveni artırmıştır). Sağ prefrontal korteks, YZ etiketli uyaranlara daha yüksek hemodinamik tepki gösterirken (LME &beta; = 0.058, p₁ = .047), sol PFC\'de herhangi bir etki görülmemiştir. Bulgular, algoritmik kaçınmayı saptanabilir nöral imzaları olan ve kültürel olarak yönlendirilen bir olgu olarak yeniden çerçevelendirmekte ve tür-YZ uyum beklentisi açıklamalarını desteklemektedir.'
    },
    'a-abstract-keywords': {
        en: '<strong>Keywords:</strong> fNIRS, algorithmic aversion, source attribution, prefrontal cortex, cultural essentialism, music perception, placebo effect',
        tr: '<strong>Anahtar Kelimeler:</strong> fNIRS, algoritmik kaçınma, kaynak atfı, prefrontal korteks, kültürel özcülük, müzik algısı, plasebo etkisi'
    },
    'a-hyp-title': { en: 'Hypotheses & Results', tr: 'Hipotezler ve Bulgular' },
    'a-h1-label': { en: 'H1 — Neural Source Expectancy [PARTIAL]', tr: 'H1 — Sinirsel Kaynak Beklentisi [KISMİ]' },
    'a-h1-pred': { en: 'Prediction: AI-labeled music will evoke greater HbO activation in prefrontal cortex than Human-labeled music.', tr: 'Beklenti: Yapay zeka etiketli müzik, İnsan etiketli müziğe göre prefrontal kortekste daha fazla HbO aktivasyonu tetikleyecektir.' },
    'a-h1-res': { en: 'Result: Right PFC Peak HbO: AI = 0.247 µM, Human = 0.193 µM, Δ = +0.055 µM. Paired t(12) = 1.60, p₁ = .068 (one-tailed). LME: β = 0.058, SE = 0.027, p₁ = .047.', tr: 'Bulgu: Sağ PFC Zirve HbO: YZ = 0.247 µM, İnsan = 0.193 µM, Δ = +0.055 µM. Eşleştirilmiş t(12) = 1.60, p₁ = .068 (tek yönlü). LME: β = 0.058, SE = 0.027, p₁ = .047.' },
    'a-h2-label': { en: 'H2 — Behavioral Labeling Effect [CONFIRMED]', tr: 'H2 — Davranışsal Etiketleme Etkisi [DOĞRULANDI]' },
    'a-h2-pred': { en: 'Prediction: Human-labeled music will receive higher Authenticity, Quality, and Emotional Investment ratings.', tr: 'Beklenti: İnsan etiketli müzik; Otantiklik, Kalite ve Duygusal Yatırım boyutlarında daha yüksek puanlar alacaktır.' },
    'a-h2-res': { en: 'Results: EI: F(1,29) = 11.07, p = .002, η²p = .276. Auth: F(1,29) = 11.55, p = .002, η²p = .285. Quality: F(1,29) = 8.49, p = .007, η²p = .227.', tr: 'Bulgular: EI: F(1,29) = 11.07, p = .002, η²p = .276. Otan.: F(1,29) = 11.55, p = .002, η²p = .285. Kalite: F(1,29) = 8.49, p = .007, η²p = .227.' },
    'a-h3-label': { en: 'H3 — Placebo Mask [PARTIAL]', tr: 'H3 — Plasebo Maskesi [KISMİ]' },
    'a-h3-pred': { en: 'Prediction: AI-generated music presented under Human label will receive higher ratings.', tr: 'Beklenti: İnsan etiketiyle sunulan yapay zeka üretimi müzik daha yüksek puanlar alacaktır.' },
    'a-h3-res': { en: 'Results: Emotional Investment: F(1,29) = 4.23, p = .049, η²p = .127.', tr: 'Bulgular: Duygusal Yatırım: F(1,29) = 4.23, p = .049, η²p = .127.' },
    'a-h5-label': { en: 'H5 — Genre Baseline [CONFIRMED]', tr: 'H5 — Müzik Türü Temel Değeri [DOĞRULANDI]' },
    'a-h5-pred': { en: 'Prediction: Electronic music will receive lower Auth and EI ratings than Arabesque or Blues.', tr: 'Beklenti: Elektronik müzik, Arabesk veya Blues türlerine göre daha düşük Otantiklik ve Duygusal Yatırım puanları alacaktır.' },
    'a-h5-res': { en: 'Results: Auth F(2,58) = 11.81, p < .001. EI F(2,58) = 41.18, p < .001 (Largest single effect).', tr: 'Bulgular: Otan. F(2,58) = 11.81, p < .001. EI F(2,58) = 41.18, p < .001 (En büyük tekil etki).' },
    'a-h6-label': { en: 'H6 — Cultural Essentialism in Arabesque [CONFIRMED]', tr: 'H6 — Arabesk Müzikte Kültürel Özcülük [DOĞRULANDI]' },
    'a-h6-pred': { en: 'Prediction: Arabesque will score highest under Human label but show largest AI penalty.', tr: 'Beklenti: Arabesk, İnsan etiketi altında en yüksek puanı alacak ancak en büyük YZ cezasını sergileyecektir.' },
    'a-h6-res': { en: 'Results: Label × Genre on EI: F(2,58) = 3.42, p = .039. AI penalty: ΔEI = −0.88.', tr: 'Bulgular: EI üzerinde Etiket × Tür etkileşimi: F(2,58) = 3.42, p = .039. YZ cezası: ΔEI = −0.88.' },
    'a-h7-label': { en: 'H7 — Acoustic Trust Gap [CONFIRMED with Reversal]', tr: 'H7 — Akustik Güven Boşluğu [Tersine Etkiyle Doğrulandı]' },
    'a-h7-pred': { en: 'Prediction: Trust gap (Human − AI) will be larger in acoustic genres than Electronic.', tr: 'Beklenti: Güven boşluğu (İnsan − YZ), akustik türlerde Elektronik müziğe kıyasla daha büyük olacaktır.' },
    'a-h7-res': { en: 'Results: Label × Genre on Trust: F(2,58) = 14.86, p < .001. Arabesque +1.14. Electronic −1.32 (REVERSAL: AI label increased trust).', tr: 'Bulgular: Güven üzerinde Etiket × Tür etkileşimi: F(2,58) = 14.86, p < .001. Arabesk +1.14. Elektronik −1.32 (TERSİNE DÖNÜŞ: YZ etiketi güveni artırdı).' },

    'a-method-p-label': { en: 'Participants:', tr: 'Katılımcılar:' },
    'a-method-p-desc': {
        en: 'Thirty healthy volunteers (17 M, 13 F; age 18-25) recruited from IUE. 13 retained for fNIRS analysis after rigorous channel-quality exclusion (SCI ≥ 0.7).',
        tr: "İzmir Ekonomi Üniversitesi'nden (İEÜ) toplanan otuz sağlıklı gönüllü (17 Erkek, 13 Kadın; yaş 18-25). Titiz kanal kalitesi elemenin ardından (SCI ≥ 0.7) 13'ü fNIRS analizi için tutulmuştur."
    },
    'a-method-s-label': { en: 'Stimuli & Design:', tr: 'Uyaranlar ve Desen:' },
    'a-method-s-desc': {
        en: '12 excerpts (25s) across Arabesque, Blues, Electronic. 2 Human-composed, 2 AI-generated (Suno v5) per genre. Within-subjects 2×2×3 factorial (Label × Producer × Genre).',
        tr: 'Arabesk, Blues, Elektronik türlerinde 12 kesit (25 saniye). Tür başına 2 İnsan yapımı, 2 Yapay Zeka üretimi (Suno v5) parça. Katılımcılar içi 2×2×3 faktöriyel (Etiket × Üretici × Tür).'
    },
    'a-method-pr-label': { en: 'Procedure:', tr: 'Prosedür:' },
    'a-method-pr-desc': {
        en: '25s playback &rarr; Label revealed at t=10s &rarr; 5-item Likert questionnaire &rarr; 10s ITI fixation.',
        tr: "25 sn oynatma &rarr; t=10 sn'de Etiket gösterimi &rarr; 5 maddelik Likert anketi &rarr; 10 sn ITI fiksasyon."
    },
    'a-method-m-label': { en: 'Measures:', tr: 'Ölçümler:' },
    'a-method-m-desc': {
        en: '7-point Likert (Emotional Investment, Authenticity, Trust, Liking, Quality). fNIRS: fNIR Devices fNIR 1000, 16-channel prefrontal montage (730/850 nm).',
        tr: "7'li Likert (Duygusal Yatırım, Otantiklik, Güven, Beğeni, Kalite). fNIRS: fNIR Devices fNIR 1000, 16 kanallı prefrontal montaj (730/850 nm)."
    },
    'a-method-pl-label': { en: 'Preprocessing Pipeline:', tr: 'Ön İşleme Akışı:' },
    'a-method-pl-desc': {
        en: 'Scalp Coupling Index, Modified Beer-Lambert Law (DPF = 6.0), Bandpass filter (0.01–0.2 Hz), Spike rejection, Epoching (−10s to +15s), Baseline correction, Peak HbO extraction (4-15s post-label).',
        tr: 'Saç Derisi Bağlantı İndeksi (SCI), Modifiye Edilmiş Beer-Lambert Yasası (DPF = 6.0), Bant geçiren filtre (0.01-0.2 Hz), Gürültü/Sıçrama ayıklama, Epoklama (-10 sn ila +15 sn), Temel çizgi düzeltmesi, Zirve HbO çıkarımı (etiket sonrası 4-15 sn).'
    },
    'a-results-insight-label': { en: '"AI" LABEL', tr: '"YZ" ETİKETİ' },
    'a-results-insight-value': { en: 'Right PFC Peak HbO', tr: 'Sağ PFC Zirve HbO' },
    'a-results-insight-desc': {
        en: 'Linear Mixed-Effects (LME): <em>β<sub>1</sub></em> = 0.058, SE = 0.027, <em>p</em> = .047<br><span class="u-fs-ff">Right PFC Peak HbO (µM): AI [0.247], Human [0.193]</span>',
        tr: 'Doğrusal Karma Etkiler (LME): <em>β<sub>1</sub></em> = 0.058, SE = 0.027, <em>p</em> = .047<br><span class="u-fs-ff">Sağ PFC Zirve HbO (µM): YZ [0.247], İnsan [0.193]</span>'
    },
    'a-explore-e1': {
        en: '<strong class="u-text-white">E1 - The Authenticity Hierarchy:</strong> Human-produced music consistently rated higher in authenticity across all conditions (F(1,29)=7.8, p=.009, η²p=.212).',
        tr: '<strong class="u-text-white">E1 - Otantiklik Hiyerarşisi:</strong> İnsan yapımı müzik, tüm koşullarda tutarlı olarak daha yüksek otantiklik puanı almıştır (F(1,29)=7.8, p=.009, η²p=.212).'
    },
    'a-explore-e2': {
        en: '<strong class="u-text-white">E2 - Right-Lateralized Label Effect:</strong> Label effect isolated to Right PFC (p=.047). Left PFC showed no significant variation based on label (p=.68).',
        tr: '<strong class="u-text-white">E2 - Sağ-Lateralize Etiket Etkisi:</strong> Etiket etkisi Sağ PFC ile sınırlıdır (p=.047). Sol PFC etiket durumuna göre anlamlı bir değişim göstermemiştir (p=.68).'
    },
    'a-discussion-text': {
        en: "Our data suggests that human perception of art is heavily mediated by mental models held about the creator. The AI label acts as a 'distrust cue', increasing evaluative effort in the right prefrontal cortex. The Trust reversal in Electronic music specifically highlights that algorithmic aversion is not uniform, but heavily dependent on genre-AI fit expectations.",
        tr: "Verilerimiz, insanın sanat algısının yaratıcı hakkında sahip olduğu zihinsel modeller tarafından güçlü bir şekilde yönlendirildiğini göstermektedir. Yapay zeka etiketi bir 'güvensizlik ipucu' gibi çalışarak sağ prefrontal korteksteki değerlendirme çabasını (bilişsel yükü) artırmaktadır. Elektronik müzikteki güven tersinmesi, algoritmik kaçınmanın tek tip olmadığını, müzik türü ile YZ uyumu konusundaki beklentilere son derece bağımlı olduğunu göstermektedir."
    },
    'a-limit-1': { en: 'This study was NOT pre-registered.', tr: 'Bu çalışma ön-kayıtlı (pre-registered) DEĞİLDİR.' },
    'a-limit-2': { en: 'fNIRS sample size (n=13) limits statistical power. Neural findings are exploratory.', tr: 'fNIRS örneklem boyutu (n=13) istatistiksel gücü sınırlamaktadır. Sinirsel bulgular keşfedici niteliktedir.' },
    'a-limit-3': { en: 'One-tailed tests used for directional neural hypotheses.', tr: 'Yönlü sinirsel hipotezler için tek yönlü testler kullanılmıştır.' },
    'a-limit-4': { en: 'Belief in stated source was inferred rather than assessed per trial.', tr: 'Belirtilen kaynağa olan inanç, deneme başına ölçülmek yerine doğrudan varsayılmıştır.' },
    'a-limit-5': { en: 'Sample restricted to Turkish university students.', tr: 'Örneklem yalnızca Türk üniversite öğrencileri ile sınırlıdır.' },
    'a-limit-6': { en: '2 Hz fNIRS sampling constrained cardiac-band SCI computation.', tr: '2 Hz fNIRS örnekleme frekansı, kardiyak bant SCI (Saç Derisi Bağlantı İndeksi) hesaplamasını kısıtlamıştır.' },
    'a-references-btn': { en: 'View Full Bibliography &rarr;', tr: 'Tüm Kaynakçayı Görüntüle &rarr;' },

    'a-panel-4-title': { en: 'Panel 4: Method Notes', tr: 'Panel 4: Metot Notları' },
    'a-panel-4-warning': {
        en: '<strong>Caution:</strong> This dashboard represents N=1 data with one trial per condition. It lacks sufficient statistical power for inference and is provided for illustration of the N=30 pipeline only.',
        tr: '<strong>Dikkat:</strong> Bu panel her koşul için tek denemeden oluşan N=1 verisini yansıtmaktadır. Çıkarım yapmak için yeterli istatistiksel güce sahip değildir ve yalnızca N=30 analiz akışını örneklendirmek için sunulmuştur.'
    },

    'v-dash-switch': { en: 'Switch to Academic View &rarr;', tr: 'Akademik Görünüme Geç &rarr;' },
    'toggle-academic': { en: 'Academic', tr: 'Akademik' },
    'toggle-visitor': { en: 'Visitor', tr: 'Ziyaretçi' },
    'a-header-tag': { en: 'Graduation Thesis / Experimental Psychology', tr: 'Mezuniyet Tezi / Deneysel Psikoloji' },

        'v-what-else-title': { en: "What Else Did We Notice?", tr: "Başka Ne Fark Ettik?" },
    'v-what-else-subtitle': { en: "The biggest surprise was that people did not simply dislike AI music. Instead, the AI label changed specific judgments. People were more likely to question whether the music felt trustworthy, authentic, high-quality, or emotionally meaningful. Liking was more protected.", tr: "En büyük sürpriz insanların YZ müziğinden sadece nefret etmemesiydi. Bunun yerine, YZ etiketi belirli yargıları değiştirdi. İnsanlar müziğin güvenilir, otantik, yüksek kaliteli veya duygusal olarak anlamlı hissettirip hissettirmediğini sorgulamaya daha meyilliydi. Beğeni ise daha korunmuştu." },
    'v-what-else-1-title': { en: "Trust changed most", tr: "En çok Güven değişti" },
    'v-what-else-1-text': { en: "AI labels mainly affected whether people trusted the music as meaningful or reliable.", tr: "YZ etiketleri temel olarak insanların müziği anlamlı veya güvenilir bulup bulmadığını etkiledi." },
    'v-what-else-2-title': { en: "Genre mattered", tr: "Tür önemliydi" },
    'v-what-else-2-text': { en: "Arabesque was more sensitive to AI labeling, while Electronic music sometimes made the AI label feel more fitting.", tr: "Arabesk, YZ etiketine daha duyarlıyken, Elektronik müzik bazen YZ etiketinin daha uygun hissettirmesine neden oldu." },
    'v-what-else-3-title': { en: "Liking is not the whole story", tr: "Sadece beğenmek her şey demek değildir" },
    'v-what-else-3-text': { en: "People can enjoy a song while still judging it as less authentic or less emotionally human.", tr: "İnsanlar bir şarkıdan keyif alırken bile onu daha az otantik veya daha az insani duygular barındıran bir eser olarak değerlendirebiliyor." },
    'v-what-else-disclaimer': { en: "These are behavioral patterns from the study sample. They do not mean every listener reacts the same way.", tr: "Bunlar çalışma örnekleminden elde edilen davranışsal kalıplardır. Her dinleyicinin aynı şekilde tepki verdiği anlamına gelmez." },
    'a-explore-beh-title': { en: "Exploratory Behavioral Findings", tr: "Keşfedici Davranışsal Bulgular" },
    'a-explore-beh-subtitle': { en: "Beyond the main label effects, the behavioral data suggested several genre- and dimension-specific patterns.", tr: "Temel etiket etkilerinin ötesinde, davranışsal veriler müzik türüne ve değerlendirme boyutuna özgü birkaç kalıp öne sürmüştür." },
    'a-explore-beh-1-title': { en: "1. Trust was the most label-sensitive judgment", tr: "1. Güven, etikete en duyarlı yargıydı" },
    'a-explore-beh-1-text': { en: "Among the rating dimensions, Trust appeared especially sensitive to source labeling. AI labels reduced trust more strongly than basic liking, suggesting that AI attribution primarily affects perceived agency and reliability rather than simple enjoyment. Trust showed a strong label-related effect, η²p = .339, p < .001.", tr: "Değerlendirme boyutları arasında Güven, kaynak etiketlemesine özellikle duyarlı görünmüştür. YZ etiketleri güveni basit beğeniden daha güçlü bir şekilde azaltmıştır; bu da YZ atfının basit bir keyif almaktan ziyade öncelikle algılanan eylemliliği ve güvenilirliği etkilediğini göstermektedir. Güven, güçlü bir etiketle ilişkili etki göstermiştir, η²p = .339, p < .001." },
    'a-explore-beh-2-title': { en: "2. The AI penalty was selective, not global", tr: "2. YZ cezası genel değil, seçiciydi" },
    'a-explore-beh-2-text': { en: "Participants did not simply dislike AI-labeled music across all dimensions. The AI label mainly affected higher-order judgments such as Trust, Authenticity, Quality, and Emotional Investment, while Liking was comparatively more preserved.", tr: "Katılımcılar tüm boyutlarda YZ etiketli müzikten nefret etmediler. YZ etiketi temel olarak Güven, Otantiklik, Kalite ve Duygusal Yatırım gibi üst düzey yargıları etkilerken, Beğeni görece daha fazla korunmuştur." },
    'a-explore-beh-3-title': { en: "3. Genre changed the meaning of the AI label", tr: "3. Tür, YZ etiketinin anlamını değiştirdi" },
    'a-explore-beh-3-text': { en: "The effect of the AI label depended on genre. Arabesque showed a stronger AI-label penalty, Blues appeared more label-invariant or weaker, and Electronic music showed a weaker or partially reversed AI penalty, consistent with genre-label congruency. Trust (Human − AI): Arabesque +1.14, Blues +0.10, Electronic −1.32. This suggests that AI attribution is not a universal bias; it depends on whether the label fits the cultural and acoustic expectations of the genre.", tr: "YZ etiketinin etkisi türe bağlıydı. Arabesk daha güçlü bir YZ etiketi cezası gösterdi, Blues daha fazla etiket bağımsız veya zayıf göründü ve Elektronik müzik tür-etiket uyumuyla tutarlı olarak daha zayıf veya kısmen tersine dönmüş bir YZ cezası gösterdi. Güven (İnsan − YZ): Arabesk +1.14, Blues +0.10, Elektronik −1.32. Bu, YZ atfının evrensel bir yanlılık olmadığını; etiket ile türün kültürel ve akustik beklentilerinin uyuşup uyuşmamasına bağlı olduğunu göstermektedir." },
    'a-explore-beh-4-title': { en: "4. Arabesque showed cultural sensitivity to AI labeling", tr: "4. Arabesk, YZ etiketlemesine kültürel hassasiyet gösterdi" },
    'a-explore-beh-4-text': { en: "Arabesque appeared especially sensitive to AI labeling. Because it is culturally and emotionally loaded, the AI label may have conflicted with expectations of human expression, lived experience, and cultural authenticity.", tr: "Arabesk, YZ etiketlemesine karşı özellikle duyarlı görünmüştür. Kültürel ve duygusal olarak yüklü olduğu için, YZ etiketi insan ifadesi, yaşanmışlık ve kültürel otantiklik beklentileriyle çatışmış olabilir." },
    'a-explore-beh-5-title': { en: "5. Electronic music showed possible label congruency", tr: "5. Elektronik müzik olası bir etiket uyumu gösterdi" },
    'a-explore-beh-5-text': { en: "Electronic music showed a weaker or partially reversed AI penalty. This may reflect genre-label congruency: listeners may perceive algorithmic or technological production as more compatible with electronic music than with culturally rooted acoustic genres.", tr: "Elektronik müzik, daha zayıf veya kısmen tersine dönmüş bir YZ cezası gösterdi. Bu durum, tür-etiket uyumunu yansıtıyor olabilir: dinleyiciler algoritmik veya teknolojik üretimi, kültürel kökenli akustik türlere kıyasla elektronik müzikle daha uyumlu algılıyor olabilir." },
    'a-explore-beh-6-title': { en: "6. Actual producer and displayed label came apart", tr: "6. Gerçek üretici ve gösterilen etiket birbirinden ayrıldı" },
    'a-explore-beh-6-text': { en: "The design separated what the track actually was from what participants were told it was. This allowed the study to test whether evaluation followed the sound itself or the source attribution attached to it. The displayed source label was manipulated independently of actual producer.", tr: "Araştırma deseni, parçanın gerçekte ne olduğu ile katılımcılara ne söylendiğini birbirinden ayırdı. Bu, değerlendirmenin sesin kendisini mi yoksa ona eklenen kaynak atfını mı takip ettiğini test etmeye olanak tanıdı. Gösterilen kaynak etiketi, gerçek üreticiden bağımsız olarak manipüle edildi." },
    'a-explore-beh-7-title': { en: "7. Liking and authenticity dissociated", tr: "7. Beğeni ve otantiklik ayrıştı" },
    'a-explore-beh-7-text': { en: "One of the most important behavioral patterns was the dissociation between liking and authenticity. Participants could still like a piece of music while rating it as less authentic, less trustworthy, or less emotionally meaningful when it carried an AI label. This suggests that AI-label bias targets perceived human intention more than immediate pleasure.", tr: "En önemli davranışsal kalıplardan biri beğeni ve otantiklik arasındaki ayrışmaydı. Katılımcılar YZ etiketi taşıyan bir müziği daha az otantik, daha az güvenilir veya duygusal olarak daha az anlamlı buldukları halde yine de beğenebilmişlerdir. Bu durum, YZ etiketi yanlılığının anlık zevkten ziyade algılanan insan niyetini hedef aldığını göstermektedir." },
    'a-materials-title': { en: "fNIRS Analysis Logic & Literature Basis", tr: "fNIRS Analiz Mantığı ve Literatür Temeli" },
    'a-method-fnirs-lit': { en: "fNIRS preprocessing followed a transparent, literature-informed workflow. Raw .oxy files were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). Participant and file quality control was applied before inferential analysis. Retained signals were filtered with a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to attenuate slow drift and high-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations. A local trial-level baseline was computed from the −10 to 0 s interval before label reveal and subtracted from the post-label response. HbO2 Peak was then extracted from a 4–15 s post-label HRF response window for Right and Left PFC ROIs. This window was selected as a literature-informed sensitivity window to capture the delayed hemodynamic response after label onset. Because the retained fNIRS sample was small (n = 13), all neural analyses are reported as exploratory.", tr: "fNIRS ön işlemesi şeffaf, literatüre dayalı bir akış izlemiştir. Ham .oxy dosyaları, oksijenli ve deoksijenli hemoglobin sinyalleri (HbO/HbO2 ve HbR/Deoxy) için incelenmiştir. Çıkarımsal analizden önce katılımcı ve dosya kalite kontrolü uygulanmıştır. Kalan sinyaller, göreve bağlı hemodinamik dalgalanmaları korurken yavaş sapmayı ve yüksek frekanslı fizyolojik/enstrümantal gürültüyü azaltmak için 0.01 ila 0.2 Hz'lik 4. dereceden sıfır fazlı Butterworth bant geçiren filtre ile filtrelenmiştir. Etiket gösterilmeden önceki −10 ila 0 sn aralığından deneme bazında yerel bir temel çizgi (baseline) hesaplanmış ve etiket sonrası yanıttan çıkarılmıştır. Ardından, Sağ ve Sol PFC ROI'leri için etiket sonrası 4-15 sn'lik İK (HRF) yanıt penceresinden Zirve HbO2 değeri elde edilmiştir. Bu pencere, etiket başlangıcından sonra gecikmiş hemodinamik yanıtı yakalamak için literatüre dayalı bir hassasiyet penceresi olarak seçilmiştir. Analize dahil edilen fNIRS örneklemi küçük (n = 13) olduğu için, tüm sinirsel analizler keşfedici (exploratory) olarak raporlanmıştır." },
    'a-method-q1': { en: "Why HbO2 as the primary metric?", tr: "Neden birincil ölçüm olarak HbO2?" },
    'a-method-a1': { en: "Both HbO/HbO2 and HbR/Deoxy were inspected. Inferential analyses focused on HbO2 Peak because HbO is commonly used in task-based fNIRS and typically shows stronger task-related response amplitude, while HbR was treated as a complementary signal.", tr: "Hem HbO/HbO2 hem de HbR/Deoxy incelenmiştir. Göreve dayalı fNIRS araştırmalarında yaygın olarak kullanıldığı ve tipik olarak göreve bağlı olarak daha güçlü bir yanıt genliği gösterdiği için çıkarımsal analizler HbO2 zirvesine odaklanırken, HbR tamamlayıcı bir sinyal olarak ele alınmıştır." },
    'a-method-q2': { en: "Why 0.01–0.2 Hz filtering?", tr: "Neden 0.01–0.2 Hz filtreleme?" },
    'a-method-a2': { en: "This band-pass range is commonly used to reduce very slow drift and higher-frequency physiological/instrumental noise while retaining task-related hemodynamic fluctuations.", tr: "Bu bant geçiren aralığı, göreve bağlı hemodinamik dalgalanmaları korurken, çok yavaş sapmaları ve daha yüksek frekanslı fizyolojik/enstrümantal gürültüyü azaltmak için yaygın olarak kullanılmaktadır." },
    'a-method-q3': { en: "Why local baseline −10–0 s?", tr: "Neden −10–0 sn yerel temel çizgi (baseline)?" },
    'a-method-a3': { en: "A local pre-label baseline controls for trial-to-trial drift and captures the participant’s hemodynamic state immediately before the source label appears.", tr: "Deneme öncesi yerel bir temel çizgi, denemeden denemeye sapmaları kontrol eder ve kaynak etiketi görünmeden hemen önceki katılımcının hemodinamik durumunu yakalar." },
    'a-method-q4': { en: "Why 4–15 s HRF window?", tr: "Neden 4–15 sn HRF penceresi?" },
    'a-method-a4': { en: "fNIRS hemodynamic responses are delayed relative to stimulus onset. The 4–15 s window was used as a literature-informed sensitivity window to capture the expected rise and peak response after label reveal. It should be reported as exploratory/sensitivity analysis, not as a universal standard.", tr: "fNIRS hemodinamik yanıtları, uyaran başlangıcına göre gecikmelidir. 4-15 sn penceresi, etiket gösteriminden sonra beklenen artışı ve zirve yanıtını yakalamak için literatüre dayalı bir duyarlılık penceresi olarak kullanılmıştır. Evrensel bir standart olarak değil, keşfedici/duyarlılık analizi olarak raporlanmalıdır." },
en: {
        "portal-badge": "RESEARCH PORTAL<br>IUE PSYCHOLOGY 2026",
        "landing-title": 'The <span class="accent">"AI-Placebo"</span> Effect in Music',
        "poster-main-title": 'Neuro-Cognitive Dynamics of<br><span class="accent">AI Attribution</span> in Music Perception',
        "landing-sub": "Does knowing a song is AI-generated change how you feel about it?<br>Plain-language explanation and interactive demo. Not a diagnostic brain test.",
        "who-are-you": "WHO ARE YOU?",
        "role-academic-title": "Academic / Jury",
        "role-academic-desc": "Full thesis summary, methods, statistics, and limitations.",
        "role-visitor-title": "Curious Visitor",
        "role-visitor-desc": "Plain-language explanation and interactive demo. Not a diagnostic brain test.",
        "supervisor": "Supervisor: Prof. Dr. Seda DURAL",
        "institution": "İzmir University of Economics<span class='inst-sep'> &bull; </span><br class='inst-br'>Department of Psychology",
        "btn-kapat": "CLOSE",
        "problem-title": "Problem",
        "problem-lead": "With the rise of AI-generated music, listeners' perception is shaped not only by the sound itself but by their belief about its source.",
        "problem-desc": "This study examines the cognitive and neural effects of the discrepancy between the actual source of music and the label presented — a phenomenon we term the <strong>\"AI-Placebo Effect.\"</strong>",
        "hyp-title": "Hypotheses",
        "h1-title": "Neural Skepticism:",
        "h1-desc": '"AI" labels evoke greater Right PFC activation than Human labels.',
        "h2-title": "Placebo Bias:",
        "h2-desc": '"Human" label enhances ratings regardless of actual source.',
        "h3-title": "Placebo Mask:",
        "h3-desc": "Human label suppresses the bias introduced by AI generation.",
        "h56-title": "Genre Moderation:",
        "h56-desc": "AI bias differs across Arabesque, Blues, and Electronic.",
        "how-title": "How We Did It 🔬",
        "how-desc": "We tested <strong>13 participants</strong>. They listened to different genres of music.<br><br>We told them the music was either made by a <strong>\"Human\"</strong> or an <strong>\"AI\"</strong>. While they listened, we recorded their brain activity using a safe headband (fNIRS) that uses light to see which parts of the brain are working hard!",
        "design-title": "Design",
        "design-sub": "2×2×3 Within-Subjects",
        "design-participants": "Participants",
        "design-trials": "Trials / Subject",
        "design-factor-label": "Label: AI vs Human",
        "design-factor-source": "Source: AI vs Human",
        "design-factor-genre": "Genre: 3 Types",
        "design-counter": "Counterbalanced presentation. Label assigned orthogonally to actual source.",
        "insight-label": '"AI" LABEL',
        "insight-value": "Right PFC Peak HbO by +54%",
        "brain-caption-academic": "Right Prefrontal HbO signals suggest differential cognitive engagement and skepticism.",
        "brain-caption-visitor": "Brain scans showed different activity when people thought an AI made the music.",
        "slogan": "THE LABEL ALTERS COGNITIVE LOAD",
        "slogan-sub": '"AI" labeling significantly increased Right Prefrontal Cortex activation independent of the actual music source.',
        "btn-dene": "🎧 Try — What Does Your Brain Feel?",
        "methods-title": "Methods & Analysis",
        "fnirs-title": "fNIRS Measurement",
        "pipeline-details": "[+] Pipeline Details",
        "fnirs-desc": "Prefrontal cortex HbO concentration (fNIR Imager 1000). 16 channels.",
        "procedure-title": "Procedure",
        "analysis-pipeline-title": "Analysis Pipeline",
        "raw-data": "📄 Raw Data (.csv)",
        "python-script": "🐍 Python Script",
        "spss-output": "📊 SPSS Output",
        "full-bibliography": "📚 Full Bibliography",
        "findings-title": "Findings",
        "discussion-title": "Discussion",
        "takeaways": "/ Future Work",
        "takeaway-1-title": "Future Study:",
        "takeaway-1-desc": "Future work should replicate the fNIRS component with a larger retained sample, stronger channel quality control, preregistered HRF windows, and complementary HbR analyses.",
        "takeaway-2-title": "🧐 Built-in Skepticism:",
        "takeaway-2-desc": "This pattern suggests a possible right-lateralized source-evaluation demand, but the neural evidence remains preliminary.",
        "takeaway-3-title": "🎭 The Placebo Mask:",
        "takeaway-3-desc": "Slapping a \"Human\" label on an AI song can actually make people like it more.",
        "explore-data": "EXPLORE LIVE DATA",
        "click-dashboard": "Click to view full interactive results dashboard",
        "btn-view": "View Results Dashboard &rarr;",
        "discussion-desc": "AI attribution bias is not only about sound quality. The same type of music can be evaluated differently when labeled as AI, especially in culturally meaningful genres. Behavioral findings were robust, while fNIRS findings provided preliminary right-PFC evidence that requires replication. These findings suggest that AI-content disclosure is not a neutral label. In creative domains, disclosure may shape trust, authenticity, and emotional value, especially when cultural identity is involved.",
        "exp-eyebrow-start": "EXPERIENCE THE EFFECT",
        "exp-title-start": "The AI-Placebo Quiz",
        "exp-desc-start": "Listen to 4 tracks. We will tell you if they are AI or Human. Rate them, and we will reveal the TRUTH at the end.",
        "exp-btn-start": "START EXPERIENCE",
        "exp-select-genre": "SELECT A GENRE TO START",
        "exp-parca": "TRACK",
        "exp-next-song": "Next Track &rarr;",
        "exp-originality": "1. How original did this track feel?",
        "exp-ei": "2. How much emotion do you think the producer put into this song?",
        "exp-quality": "3. How would you rate the technical quality?",
        "exp-originality-short": "Authenticity",
        "exp-ei-short": "Emotional Investment",
        "exp-quality-short": "Quality",
        "exp-reveal-eyebrow": "THE TRUTH REVEALED",
        "exp-reveal-title": "🎉 Surprise!",
        "exp-reveal-lead": "<strong>You were manipulated!</strong><br><br>Half of the labels you saw were false. Check the cards below to see where you were 'blindly' influenced by the label. <em>The label overrides the sound.</em>",
        "exp-effect-title": "Label Effect (Average Scores)",
        "exp-ai-labeled": "🤖 AI Labeled",
        "exp-human-labeled": "🧑‍🎤 Human Labeled",
        "exp-manip-title": "Song-by-Song Analysis",
        "exp-result-btn": "SEE FINAL RESULT &rarr;",
        "exp-final-eyebrow": "THE BIG DISCOVERY",
        "exp-final-title": "LABELS SHAPE EVALUATION",
        "exp-final-sub": '"AI" labeled music activated a higher Right PFC HbO2 peak in the study sample, even though the displayed source label was manipulated independently of the track\'s actual producer.',
        "exp-pill-1": "🧠 Right PFC Activity Up",
        "exp-pill-2": "💚 Cognitive Load Higher",
        "exp-pill-3": "🎵 Label Manipulated Independently",
        "exp-final-conclusion": "Behavioral and neural patterns showed tentative convergence.<br>When people saw the AI-generated label, they did not necessarily dislike the music more. Instead, they tended to rate it lower on qualities connected to human agency, such as Trust, Authenticity, Quality, and Emotional Investment.",
        "exp-try-again": "🔄 Try Again",
        "exp-back-poster": "Back to Poster"
    },
    tr: {
        "portal-badge": "ARAŞTIRMA PORTALI<br>İEU PSİKOLOJİ 2026",
        "landing-title": 'Müzikte <span class="accent">"AI-Plasebo"</span> Etkisi',
        "poster-main-title": 'Müzik Algısında<br><span class="accent">YZ Atıfının</span> Nöro-Bilişsel Dinamikleri',
        "landing-sub": "Bir şarkının yapay zeka tarafından yapıldığını bilmek ona olan hislerinizi değiştirir mi?<br>Müzik algısı ve etiket yanılığının arkasındaki sinirbilimi keşfedin.",
        "who-are-you": "KİMSİNİZ?",
        "role-academic-title": "Akademisyen / Jüri",
        "role-academic-desc": "fNIRS ön işleme, LME modelleme, Sağ PFC dinamikleri ve istatistiksel kanıtlar.",
        "role-visitor-title": "Meraklı Ziyaretçi",
        "role-visitor-desc": "Yapay zeka etiketlerinin müzik puanlamalarını nasıl değiştirdiğine dair sade bir açıklama. Teşhis amaçlı bir beyin testi değildir.",
        "supervisor": "Danışman: Prof. Dr. Seda DURAL",
        "institution": "İzmir Ekonomi Üniversitesi<span class='inst-sep'> &bull; </span><br class='inst-br'>Psikoloji Bölümü",
        "btn-kapat": "KAPAT",
        "problem-title": "Problem",
        "problem-lead": "Yapay zeka üretimi müziğin artışıyla birlikte, dinleyicilerin algısı sadece sesin kendisiyle değil, kaynağı hakkındaki inançlarıyla da şekilleniyor.",
        "problem-desc": "Bu çalışma, müziğin gerçek kaynağı ile sunulan etiket arasındaki tutarsızlığın bilişsel ve sinirsel etkilerini incelemektedir — bu olguya <strong>\"AI-Plasebo Etkisi\"</strong> adını veriyoruz.",
        "hyp-title": "Hipotezler",
        "h1-title": "Sinirsel Şüphecilik:",
        "h1-desc": '"AI" etiketleri, İnsan etiketlerine göre daha fazla Sağ PFC aktivasyonu tetikler.',
        "h2-title": "Plasebo Yanlılığı:",
        "h2-desc": '"İnsan" etiketi, gerçek kaynaktan bağımsız olarak beğeniyi artırır.',
        "h3-title": "Plasebo Maskesi:",
        "h3-desc": "İnsan etiketi, yapay zeka üretiminin getirdiği yanlılığı baskılar.",
        "h56-title": "Tür Moderasyonu:",
        "h56-desc": "AI yanlılığı Arabesk, Blues ve Elektronik türlerinde farklılık gösterir.",
        "how-title": "Nasıl Yaptık? 🔬",
        "how-desc": "<strong>13 katılımcı</strong> ile test ettik. Farklı türlerde müzikler dinlettik.<br><br>Onlara müziğin ya bir <strong>\"İnsan\"</strong> ya da bir <strong>\"AI\"</strong> tarafından yapıldığını söyledik. Onlar dinlerken, beynin hangi kısımlarının sıkı çalıştığını görmek için ışık kullanan güvenli bir kafa bandı (fNIRS) ile beyin aktivitelerini kaydettik!",
        "design-title": "Desen",
        "design-sub": "2×2×3 Gruplar İçi",
        "design-participants": "Katılımcı",
        "design-trials": "Deneme / Katılımcı",
        "design-factor-label": "Etiket: AI vs İnsan",
        "design-factor-source": "Kaynak: AI vs İnsan",
        "design-factor-genre": "Tür: 3 Çeşit",
        "design-counter": "Dengelenmiş sunum. Etiket, gerçek kaynaktan bağımsız olarak atandı.",
        "insight-label": '"AI" ETİKETİ',
        "insight-value": "Sağ PFC Zirve HbO: +%54",
        "brain-caption-academic": "Sağ Prefrontal HbO sinyalleri farklı bilişsel etkileşim ve şüpheciliğe işaret eder.",
        "brain-caption-visitor": "Beyin taramaları, insanlar bir AI'nın müziği yaptığını düşündüklerinde farklı aktiviteler gösterdi.",
        "slogan": "ETİKET BİLİŞSEL YÜKÜ DEĞİŞTİRİYOR",
        "slogan-sub": '"AI" etiketlemesi, gerçek müzik kaynağından bağımsız olarak Sağ Prefrontal Korteks aktivasyonunu önemli ölçüde artırdı.',
        "btn-dene": "🎧 Dene — Beynin Ne Hisseder?",
        "methods-title": "Metot ve Analiz",
        "fnirs-title": "fNIRS Ölçümü",
        "pipeline-details": "[+] Akış Detayları",
        "fnirs-desc": "Prefrontal korteks HbO konsantrasyonu (fNIR Imager 1000). 16 kanal.",
        "procedure-title": "Prosedür",
        "analysis-pipeline-title": "Analiz Akışı",
        "raw-data": "📄 Ham Veri (.csv)",
        "python-script": "🐍 Python Betiği",
        "spss-output": "📊 SPSS Output",
        "full-bibliography": "📚 Tam Kaynakça",
        "findings-title": "Bulgular",
        "discussion-title": "Tartışma",
        "takeaways": "/ Temel Çıkarımlar",
        "takeaway-1-title": "🏷️ Etiket Sesi Ezer:",
        "takeaway-1-desc": "Müzik tamamen aynı olsa bile, 'AI' olduğunu bilmek dinleyiş şeklinizi değiştirir.",
        "takeaway-2-title": "🧐 Doğal Şüphecilik:",
        "takeaway-2-desc": "'AI' etiketi, beynin eleştirel değerlendirme ve güvensizlik ile ilgili bölgesini aktive eder.",
        "takeaway-3-title": "🎭 Plasebo Maskesi:",
        "takeaway-3-desc": "Bir AI şarkısına 'İnsan' etiketi yapıştırmak, insanların onu daha çok beğenmesini sağlayabilir.",
        "explore-data": "CANLI VERİYİ KEŞFET",
        "click-dashboard": "İnteraktif sonuç panelini görüntülemek için tıklayın",
        "btn-view": "Sonuç Panelini Görüntüle &rarr;",
        "discussion-desc": "Verilerimiz, insanın sanat algısının yaratıcı hakkında sahip olduğumuz <strong>zihinsel modeller</strong> tarafından büyük ölçüde yönlendirildiğini göstermektedir. AI etiketi bir 'güvensizlik ipucu' olarak işlev görerek değerlendirme çabasını artırmaktadır.",
        "exp-eyebrow-start": "ETKİYİ DENEYİMLEYİN",
        "exp-title-start": "AI-Plasebo Testi",
        "exp-desc-start": "4 parça dinleyin. Size bunların AI mi yoksa İnsan mı olduğunu söyleyeceğiz. Puanlayın ve sonunda GERÇEĞİ açıklayacağız.",
        "exp-btn-start": "DENEYİME BAŞLA",
        "exp-select-genre": "BAŞLAMAK İÇİN BİR TÜR SEÇİN",
        "exp-parca": "PARÇA",
        "exp-next-song": "Sonraki Parça &rarr;",
        "exp-originality": "1. Bu parça size ne kadar özgün hissettirdi?",
        "exp-ei": "2. Üreticinin bu şarkıya ne kadar duygu kattığını düşünüyorsun?",
        "exp-quality": "3. Bu şarkıyı ne kadar kaliteli buldunuz?",
        "exp-originality-short": "Özgünlük",
        "exp-ei-short": "Duygusal Yatırım",
        "exp-quality-short": "Kalite",
        "exp-reveal-eyebrow": "GERÇEK ETİKET AÇIKLANDI",
        "exp-reveal-title": "🎉 Sürpriz!",
        "exp-reveal-lead": "<strong>Manipüle Edildiniz!</strong><br><br>Gördüğünüz etiketlerin yarısı yanlıştı. Aşağıdaki kartlarda hangi şarkılarda 'fark etmeden' manipülasyona uğradığınızı görebilirsiniz. <em>Etiket, sesi ezer.</em>",
        "exp-effect-title": "Etiket Etkisi (Ortalama Puanlar)",
        "exp-ai-labeled": "🤖 AI Etiketli",
        "exp-human-labeled": "🧑‍🎤 İnsan Etiketli",
        "exp-manip-title": "Şarkı Bazlı Analiz (Manipülasyon)",
        "exp-result-btn": "SONUCU GÖR &rarr;",
        "exp-final-eyebrow": "ARAŞTIRMANIN BÜYÜK BULGUSU",
        "exp-final-title": "ETİKETLER DEĞERLENDİRMEYİ ŞEKİLLENDİRİR",
        "exp-final-sub": '"AI" etiketli müzik, görüntülenen kaynak etiketi parçanın gerçek üreticisinden bağımsız olarak manipüle edilmiş olmasına rağmen, sağ prefrontal kortekste daha yüksek bir HbO2 zirvesi gösterdi (keşfedici bulgu).',
        "exp-pill-1": "🧠 Sağ PFC Aktivasyonu Arttı",
        "exp-pill-2": "💚 Bilişsel Yük Yükseldi",
        "exp-pill-3": "🎵 Müzik Aynıydı",
        "exp-final-conclusion": "Beynimiz müziği değil, <strong>etiketini</strong> değerlendiriyor.<br>İnsanlar AI etiketini gördüğünde müziği otomatik olarak daha eleştirel dinliyor.",
        "exp-try-again": "🔄 Tekrar Dene",
        "exp-back-poster": "Postere Dön"
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Update all language switchers' active states and accessibility attributes
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-arg') === lang;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        btn.classList.toggle('active', isActive);
    });
    
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Update text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        } else if (translations[key] && translations[key][lang] !== undefined) {
            el.innerHTML = translations[key][lang];
        }
    });

    // Update titles/tooltips
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        let val = '';
        if (translations[lang] && translations[lang][key] !== undefined) {
            val = translations[lang][key];
        } else if (translations[key] && translations[key][lang] !== undefined) {
            val = translations[key][lang];
        }
        if (val) el.setAttribute('title', val);
    });

    // Dynamic Title
    document.title = lang === 'tr' 
        ? "Müzikte Yapay Zeka Atıfının Nöro-Bilişsel Dinamikleri" 
        : "Neuro-Cognitive Dynamics of AI Attribution in Music";

    // Dynamic Chart Labels Update
    updateChartLanguage(lang);
}

function updateChartLanguage(lang) {
    // 1. Hero Chart
    if (typeof heroChart !== 'undefined' && heroChart) {
        if (lang === 'tr') {
            heroChart.data.labels = ['"YZ" Etiketi', '"İnsan" Etiketi'];
            heroChart.data.datasets[0].label = 'Sağ PFC Zirve HbO (µM)';
        } else {
            heroChart.data.labels = ['"AI" Label', '"Human" Label'];
            heroChart.data.datasets[0].label = 'Right PFC Peak HbO (µM)';
        }
        heroChart.update();
    }

    // 2. Genre Chart
    if (typeof genreChart !== 'undefined' && genreChart) {
        if (lang === 'tr') {
            genreChart.data.labels = ['Arabesk', 'Blues', 'Elektronik'];
            genreChart.data.datasets[0].label = 'İnsan Etiketi';
            genreChart.data.datasets[1].label = 'YZ Etiketi';
        } else {
            genreChart.data.labels = ['Arabesque', 'Blues', 'Electronic'];
            genreChart.data.datasets[0].label = 'Human Label';
            genreChart.data.datasets[1].label = 'AI Label';
        }
        genreChart.update();
    }

    // 3. HbO Chart
    if (typeof hboChart !== 'undefined' && hboChart) {
        if (lang === 'tr') {
            hboChart.data.labels = ['10sn (Etiket)', '13sn', '16sn', '19sn', '22sn', '25sn (Bitiş)'];
            hboChart.data.datasets[0].label = 'YZ Etiketi Denemesi (Sağ PFC)';
            hboChart.data.datasets[1].label = 'İnsan Etiketi Denemesi (Sağ PFC)';
            if (hboChart.options.scales && hboChart.options.scales.y && hboChart.options.scales.y.title) {
                hboChart.options.scales.y.title.text = 'Δ HbO (µM)';
            }
        } else {
            hboChart.data.labels = ['10s (Label)', '13s', '16s', '19s', '22s', '25s (Offset)'];
            hboChart.data.datasets[0].label = 'AI Label Trial (Right PFC)';
            hboChart.data.datasets[1].label = 'Human Label Trial (Right PFC)';
            if (hboChart.options.scales && hboChart.options.scales.y && hboChart.options.scales.y.title) {
                hboChart.options.scales.y.title.text = 'Δ HbO (µM)';
            }
        }
        hboChart.update();
    }
}

// 1. MAIN HERO CHART
const ctxHero = document.getElementById('heroChart');
if (ctxHero && typeof Chart !== 'undefined') {
    heroChart = new Chart(ctxHero.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['"AI" Label', '"Human" Label'],
            datasets: [{
                label: 'Right PFC Peak HbO (µM)',
                data: [0.247, 0.193],
                backgroundColor: [accentColor, 'rgba(255, 255, 255, 0.2)'],
                borderColor: [accentColor, 'rgba(255, 255, 255, 0.5)'],
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 0.3, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false }, ticks: { font: { size: 14, weight: 'bold' }, color: '#fff' } }
            }
        }
    });
}

// 2. GENRE INTERACTION CHART
const ctxGenre = document.getElementById('genreChart');
if (ctxGenre && typeof Chart !== 'undefined') {
    genreChart = new Chart(ctxGenre.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Arabesque', 'Blues', 'Electronic'],
            datasets: [
                { label: 'Human Label', data: [6.1, 5.2, 4.8], borderColor: accentColor, backgroundColor: accentColor, tension: 0.4 },
                { label: 'AI Label', data: [2.5, 3.8, 4.2], borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.5)', borderDash: [5, 5], tension: 0.4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 7 } } }
    });
}

// 3. HbO CHART
const ctxHbo = document.getElementById('hboChart');
if (ctxHbo && typeof Chart !== 'undefined') {
    hboChart = new Chart(ctxHbo.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['10s (Label)', '13s', '16s', '19s', '22s', '25s (Offset)'],
            datasets: [
                { label: 'AI Label Trial (Right PFC)', data: [0, 0.04, 0.11, 0.247, 0.14, 0.12], borderColor: '#a0b8ff', backgroundColor: 'rgba(160, 184, 255, 0.1)', fill: true, tension: 0.4 },
                { label: 'Human Label Trial (Right PFC)', data: [0, 0.03, 0.07, 0.193, 0.09, 0.06], borderColor: accentColor, backgroundColor: 'rgba(29, 185, 84, 0.1)', fill: true, tension: 0.4 }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'Δ HbO (µM)', color: '#fff' }
                } 
            } 
        } 
    });
}

function toggleInteractiveDashboard() {
    const overlay = document.getElementById("dashboardOverlay");
    if(overlay && !overlay.classList.contains("active")) {
        window.lastFocusedElement = document.activeElement;
        setTimeout(() => { const focusable = overlay.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex=\'-1\'])"); if(focusable) focusable.focus(); }, 100);
    } else {
        if(window.lastFocusedElement) { window.lastFocusedElement.focus(); window.lastFocusedElement = null; }
    }
    if(overlay) {
        overlay.classList.toggle('active');
        if(overlay.classList.contains('active')) lockBodyScroll();
        else unlockBodyScroll();
    }
}

function selectRole(role) {
    document.getElementById('roleOverlay').classList.remove('active');
    unlockBodyScroll();
    if (typeof expAudio !== 'undefined' && expAudio) expAudio.pause();

    localStorage.setItem('userPath', role);

    document.body.classList.remove('mode-academic', 'mode-visitor');
    if (role === 'visitor') {
        document.body.classList.add('mode-visitor');
    } else {
        document.body.classList.add('mode-academic');
    }
    window.scrollTo(0, 0);
}

function togglePath() {
    const currentPath = localStorage.getItem('userPath') === 'visitor' ? 'visitor' : 'academic';
    const newPath = currentPath === 'visitor' ? 'academic' : 'visitor';
    selectRole(newPath);
}

function backToLanding() {
    document.getElementById('roleOverlay').classList.add('active');
    lockBodyScroll();
    document.body.classList.remove('mode-visitor', 'mode-academic');
    localStorage.removeItem('userPath');
    if (typeof expAudio !== 'undefined' && expAudio) {
        expAudio.pause();
        expAudio = null;
    }
}

function toggleDeepDive() {
    document.getElementById('deepDiveBlock').classList.toggle('active');
}

// ============================================================
// EXPERIENCE THE EFFECT - QUIZ LOGIC
// ============================================================
let quizState = {
    genre: null,
    playlist: [],
    currentIndex: 0,
    answers: [],
    currentAnswers: { q1: null, q2: null, q3: null }
};

function openExperienceModal() {
    window.lastFocusedElement = document.activeElement;
    setTimeout(() => { const focusable = document.getElementById("expOverlay").querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex=\'-1\'])"); if(focusable) focusable.focus(); }, 100);
    document.getElementById('expOverlay').classList.add('active');
    lockBodyScroll();
    expStage(1);
}

function closeExperience() {
    if(window.lastFocusedElement) { window.lastFocusedElement.focus(); window.lastFocusedElement = null; }
    document.getElementById('expOverlay').classList.remove('active');
    unlockBodyScroll();
    if (expAudio) { expAudio.pause(); expAudio = null; }
    document.querySelectorAll('.listen-btn').forEach(btn => btn.classList.remove('playing'));
}

function expStage(n) {
    ['1', '2', '3'].forEach(i => {
        const el = document.getElementById('stage' + i);
        if (el) el.style.display = i == n ? 'block' : 'none';
    });
    // Stage değişince overlay'i her zaman en üste kaydır
    const overlay = document.getElementById('expOverlay');
    if (overlay) overlay.scrollTop = 0;
}

function setGenre(g) {
    quizState.genre = g;
    quizState.currentIndex = 0;
    quizState.answers = [];
    
    const prefix = g === 'arabesque' ? 'ara' : (g === 'electronic' ? 'elec' : g);
    
    let tracks = [
        { path: `assets/Music/AI/${prefix}_a1.wav`, source: 'AI', label: 'AI' },
        { path: `assets/Music/AI/${prefix}_a2.wav`, source: 'AI', label: 'Human' },
        { path: `assets/Music/Human/${prefix}_h1.wav`, source: 'Human', label: 'AI' },
        { path: `assets/Music/Human/${prefix}_h2.wav`, source: 'Human', label: 'Human' }
    ];
    // Shuffle the tracks
    tracks.sort(() => Math.random() - 0.5);

    quizState.playlist = tracks;

    expStage(2);
    playQuizSong();
}

function playQuizSong() {
    if (quizState.currentIndex >= 4) {
        showReveal();
        return;
    }

    const current = quizState.playlist[quizState.currentIndex];
    
    // Translation handling for dynamic text
    const labelTitle = document.getElementById('quiz-label-title');
    const progressEl = document.getElementById('quiz-progress');
    
    if (currentLang === 'tr') {
        progressEl.textContent = `PARÇA ${quizState.currentIndex + 1} / 4`;
        if (current.label === 'AI') {
            labelTitle.textContent = "Bu bir AI tarafından Üretilmiştir.";
            labelTitle.style.color = '#a0b8ff';
        } else {
            labelTitle.textContent = "Bu bir İnsan tarafından Üretilmiştir.";
            labelTitle.style.color = '#1DB954';
        }
    } else {
        progressEl.textContent = `TRACK ${quizState.currentIndex + 1} / 4`;
        if (current.label === 'AI') {
            labelTitle.textContent = "This is Generated by an AI.";
            labelTitle.style.color = '#a0b8ff';
        } else {
            labelTitle.textContent = "This is Composed by a Human.";
            labelTitle.style.color = '#1DB954';
        }
    }

    if (expAudio) expAudio.pause();
    expAudio = new Audio(current.path);
    expAudio.loop = true;

    setupQuizAudioListeners();
    setQuizAudioStatus('loading');

    expAudio.play()
        .then(() => {
            // Already handled by play event listener
        })
        .catch(e => {
            console.log('Audio blocked', e);
            setQuizAudioStatus('blocked');
        });

    quizState.currentAnswers = { q1: null, q2: null, q3: null };
    document.querySelectorAll('.likert-scale span').forEach(s => { s.classList.remove('selected'); s.setAttribute('aria-checked', 'false'); });
    const btn = document.getElementById('nextSongBtn');
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
}

function setQuizAudioStatus(status) {
    const statusEl = document.getElementById('quizAudioStatus');
    const playIcon = document.getElementById('playBtnIcon');
    const eq = document.querySelector('.exp-eq');
    
    if (!statusEl) return;
    
    if (status === 'playing') {
        statusEl.textContent = currentLang === 'tr' ? 'Oynatılıyor...' : 'Playing...';
        statusEl.style.color = 'var(--accent)';
        if (eq) eq.classList.add('playing');
        if (playIcon) playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    } else if (status === 'paused') {
        statusEl.textContent = currentLang === 'tr' ? 'Duraklatıldı' : 'Paused';
        statusEl.style.color = 'var(--text-muted)';
        if (eq) eq.classList.remove('playing');
        if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else if (status === 'loading') {
        statusEl.textContent = currentLang === 'tr' ? 'Yükleniyor...' : 'Loading...';
        statusEl.style.color = '#f39c12';
        if (eq) eq.classList.remove('playing');
        if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    } else if (status === 'blocked') {
        statusEl.textContent = currentLang === 'tr' ? 'Dinlemek için Oynat\'a Tıklayın' : 'Tap Play to Listen';
        statusEl.style.color = '#e74c3c';
        if (eq) eq.classList.remove('playing');
        if (playIcon) playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
}

function setupQuizAudioListeners() {
    if (!expAudio) return;
    
    expAudio.onplay = () => {
        setQuizAudioStatus('playing');
    };
    
    expAudio.onpause = () => {
        setQuizAudioStatus('paused');
    };
    
    expAudio.onwaiting = () => {
        setQuizAudioStatus('loading');
    };
    
    expAudio.onplaying = () => {
        setQuizAudioStatus('playing');
    };
}

function toggleQuizAudio() {
    if (!expAudio) return;
    
    if (expAudio.paused) {
        expAudio.play().catch(e => {
            console.log('Audio play failed', e);
            setQuizAudioStatus('blocked');
        });
    } else {
        expAudio.pause();
    }
}

function selectLikert(qId, val) {
    quizState.currentAnswers[qId] = parseInt(val);
    const parent = document.getElementById(qId);
    parent.querySelectorAll('span').forEach(s => {
        s.classList.remove('selected');
        s.setAttribute('aria-checked', 'false');
    });
    const target = parent.querySelectorAll('span')[val-1];
    target.classList.add('selected');
    target.setAttribute('aria-checked', 'true');

    if (quizState.currentAnswers.q1 && quizState.currentAnswers.q2 && quizState.currentAnswers.q3) {
        const btn = document.getElementById('nextSongBtn');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }
}

function nextQuizSong() {
    let currentTrack = quizState.playlist[quizState.currentIndex];
    quizState.answers.push({
        label: currentTrack.label,
        source: currentTrack.source,
        path: currentTrack.path, // Store the path for re-listening
        scores: { ...quizState.currentAnswers }
    });
    quizState.currentIndex++;
    playQuizSong();
}

function showReveal() {
    if (expAudio) expAudio.pause();
    expStage(3);

    let sums = {
        AI: { q1: 0, q2: 0, q3: 0, count: 0 },
        Human: { q1: 0, q2: 0, q3: 0, count: 0 }
    };

    const breakdownContainer = document.getElementById('expSongBreakdown');
    if (breakdownContainer) {
        breakdownContainer.innerHTML = '';
    }

    quizState.answers.forEach((a, idx) => {
        let label = a.label; 
        sums[label].q1 += a.scores.q1;
        sums[label].q2 += a.scores.q2;
        sums[label].q3 += a.scores.q3;
        sums[label].count++;

        if (breakdownContainer) {
            // Build Song Card
            const isManipulated = a.label !== a.source;
            const card = document.createElement('div');
            card.className = 'song-card' + (isManipulated ? ' manipulated' : '');
            
            let labelText, sourceText, listenText, manipBadge;
            if(currentLang === 'tr') {
                labelText = a.label === 'AI' ? '🤖 AI' : '🧑‍🎤 İnsan';
                sourceText = a.source === 'AI' ? '🤖 AI' : '🧑‍🎤 İnsan';
                listenText = "DİNLE";
                manipBadge = "MANİPÜLE";
            } else {
                labelText = a.label === 'AI' ? '🤖 AI' : '🧑‍🎤 Human';
                sourceText = a.source === 'AI' ? '🤖 AI' : '🧑‍🎤 Human';
                listenText = "LISTEN";
                manipBadge = "MANIPULATED";
            }
            card.innerHTML = `
                <div class="song-card-header">
                    <span class="song-num">TRACK ${idx + 1}</span>
                    <button class="listen-btn" data-action="playIndividualSong" data-arg="${a.path},this">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        ${listenText}
                    </button>
                </div>
                <span class="song-status">
                    Label: ${labelText}
                    ${isManipulated ? `<span class="manip-badge">${manipBadge}</span>` : ''}
                </span>
                <div class="card-meta">
                    Real Source: ${sourceText}<br>
                    Your Score (Avg): ${((a.scores.q1 + a.scores.q2 + a.scores.q3) / 3).toFixed(1)}
                </div>
            `;
            breakdownContainer.appendChild(card);
        }
    });

    const calculateAvg = (label, qKey) => {
        return sums[label].count > 0 ? (sums[label][qKey] / sums[label].count) : 0;
    };

    const hAuth = calculateAvg('Human', 'q1');
    const aAuth = calculateAvg('AI', 'q1');
    
    const authPenalty = (hAuth - aAuth).toFixed(2);
    const authPenaltyStr = (authPenalty > 0 ? '+' : '') + authPenalty;

    // --- ACADEMIC DASHBOARD POPULATION ---
    const acadScore = document.getElementById('acad-penalty-score');
    if(acadScore) acadScore.innerText = authPenaltyStr;
    
    const replH2 = document.getElementById('repl-h2');
    if(replH2) {
        replH2.innerText = (hAuth > aAuth) 
            ? (currentLang === 'tr' ? 'Desteklendi (Örneklem: Evet)' : 'Supported (Sample: Yes)') 
            : (currentLang === 'tr' ? 'Desteklenmedi (Örneklem: Evet)' : 'Not Supported (Sample: Yes)');
        replH2.style.color = (hAuth > aAuth) ? '#1db954' : '#e74c3c';
    }

    const replH6 = document.getElementById('repl-h6');
    if(replH6) replH6.innerText = currentLang === 'tr' ? 'Veri yetersiz (N=1)' : 'Data insufficient (N=1)';
    
    const replH7 = document.getElementById('repl-h7');
    if(replH7) replH7.innerText = currentLang === 'tr' ? 'Veri yetersiz (N=1)' : 'Data insufficient (N=1)';

    const tbody = document.getElementById('acad-stats-table');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td class="u-p-clr">${currentLang === 'tr' ? 'İnsan Etiketli' : 'Human-Labeled'}</td>
                <td class="u-p-clr">${hAuth.toFixed(2)}</td>
                <td class="u-p-clr">${calculateAvg('Human', 'q2').toFixed(2)}</td>
                <td class="u-p-clr">${calculateAvg('Human', 'q3').toFixed(2)}</td>
            </tr>
            <tr>
                <td class="u-p-clr">${currentLang === 'tr' ? 'YZ Etiketli' : 'AI-Labeled'}</td>
                <td class="u-p-clr">${aAuth.toFixed(2)}</td>
                <td class="u-p-clr">${calculateAvg('AI', 'q2').toFixed(2)}</td>
                <td class="u-p-clr">${calculateAvg('AI', 'q3').toFixed(2)}</td>
            </tr>
        `;
    }

    // --- VISITOR DASHBOARD POPULATION ---
    const visScore = document.getElementById('vis-penalty-score');
    if (visScore) visScore.innerText = authPenaltyStr;
    
    const visNum = document.getElementById('vis-penalty-num');
    if (visNum) visNum.innerText = Math.abs(authPenalty).toFixed(2);
    
    let typeTitle = "";
    let typeDesc = "";
    let typeIcon = "";

    if (authPenalty > 0.5) {
        typeTitle = currentLang === 'tr' ? "Kültürel Koruyucu" : "Cultural Protector";
        typeDesc = currentLang === 'tr' ? "Müzik YZ olarak etiketlendiğinde onu güçlü bir şekilde cezalandırıyorsun. İnsan hikayesi senin için çok önemli." : "You strongly penalize music when it's labeled as AI. The human story matters deeply to you.";
        typeIcon = "🛡️";
    } else if (authPenalty < -0.5) {
        typeTitle = currentLang === 'tr' ? "Teknoloji Sever" : "Tech Embracer";
        typeDesc = currentLang === 'tr' ? "Müzik YZ olarak etiketlendiğinde aslında onu daha çok seviyor veya güveniyorsun! Çağın ilerisindesin." : "You actually prefer or trust the music more when it's labeled AI! You are ahead of the curve.";
        typeIcon = "🚀";
    } else {
        typeTitle = currentLang === 'tr' ? "Tür Tarafsızı" : "Genre Neutral";
        typeDesc = currentLang === 'tr' ? "Etiket, müziğe verdiğin puanı pek değiştirmiyor. Sen hikayeyi değil, sesi dinliyorsun." : "The label barely changes how you rate music. You listen to the sound, not the story.";
        typeIcon = "🎧";
    }

    const typeTitleEl = document.getElementById('vis-type-title');
    if (typeTitleEl) typeTitleEl.innerText = typeTitle;
    
    const typeDescEl = document.getElementById('vis-type-desc');
    if (typeDescEl) typeDescEl.innerText = typeDesc;
    
    const typeIconEl = document.getElementById('vis-type-icon');
    if (typeIconEl) typeIconEl.innerText = typeIcon;

    const revealText = document.getElementById('expRevealText');
    if(currentLang === 'tr') {
        revealText.innerHTML = `<strong>Manipüle Edildiniz!</strong><br><br>Gördüğünüz etiketlerin bazıları yanlıştı. Aşağıdaki kartlarda hangi şarkılarda "fark etmeden" manipülasyona uğradığınızı görebilirsiniz. <em>Etiket, sesi ezer.</em>`;
    } else {
        revealText.innerHTML = `<strong>You were manipulated!</strong><br><br>Some of the labels you saw were false. Check the cards below to see where you were 'blindly' influenced by the label. <em>The label overrides the sound.</em>`;
    }
}

function playIndividualSong(path, btn) {
    if (expAudio) {
        expAudio.pause();
        if (expAudio.src.includes(path)) {
            expAudio = null;
            document.querySelectorAll('.listen-btn').forEach(b => b.classList.remove('playing'));
            return;
        }
    }

    document.querySelectorAll('.listen-btn').forEach(b => b.classList.remove('playing'));
    btn.classList.add('playing');

    expAudio = new Audio(path);
    expAudio.play().catch(e => console.log('Audio blocked', e));
    
    expAudio.onended = () => {
        btn.classList.remove('playing');
        expAudio = null;
    };
}

// Initialize Language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
    
    // Check localStorage for saved path
    const savedPath = localStorage.getItem('userPath');
    if (savedPath) {
        selectRole(savedPath);
    } else {
        // Ensure body is locked if overlay is active on start
        if(document.getElementById('roleOverlay').classList.contains('active')) {
            lockBodyScroll();
        }
    }

    // Likert Scales Keyboard Accessibility
    document.querySelectorAll('.likert-scale').forEach(scale => {
        const spans = scale.querySelectorAll('span');
        spans.forEach((span, idx) => {
            span.setAttribute('tabindex', '0');
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    span.click();
                } else if (e.key === 'ArrowRight' && idx < spans.length - 1) {
                    spans[idx + 1].focus();
                } else if (e.key === 'ArrowLeft' && idx > 0) {
                    spans[idx - 1].focus();
                }
            });
        });
    });

    // Path Toggle Keyboard Accessibility
    const pathToggle = document.querySelector('.path-toggle');
    if (pathToggle) {
        pathToggle.setAttribute('role', 'button');
        pathToggle.setAttribute('tabindex', '0');
        pathToggle.setAttribute('aria-label', 'Switch View Mode');
        pathToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pathToggle.click();
            }
        });
    }
});


// === WO2: Event delegation (CSP-safe) ===
const actionMap = {
    setLanguage: typeof setLanguage !== 'undefined' ? setLanguage : null,
    selectRole: typeof selectRole !== 'undefined' ? selectRole : null,
    backToLanding: typeof backToLanding !== 'undefined' ? backToLanding : null,
    togglePath: typeof togglePath !== 'undefined' ? togglePath : null,
    openExperienceModal: typeof openExperienceModal !== 'undefined' ? openExperienceModal : null,
    closeExperience: typeof closeExperience !== 'undefined' ? closeExperience : null,
    expStage: typeof expStage !== 'undefined' ? expStage : null,
    nextQuizSong: typeof nextQuizSong !== 'undefined' ? nextQuizSong : null,
    setGenre: typeof setGenre !== 'undefined' ? setGenre : null,
    toggleQuizAudio: typeof toggleQuizAudio !== 'undefined' ? toggleQuizAudio : null,
    selectLikert: typeof selectLikert !== 'undefined' ? selectLikert : null,
    toggleInteractiveDashboard: typeof toggleInteractiveDashboard !== 'undefined' ? toggleInteractiveDashboard : null,
    playIndividualSong: typeof playIndividualSong !== 'undefined' ? playIndividualSong : null,
    alert: (msg) => alert(msg)
};

document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    const fn = actionMap[action];
    if (typeof fn === 'function') {
        let args = [];
        if (el.dataset.arg) {
            args = el.dataset.arg.split(',').map(a => {
                const trimmed = a.trim();
                if (trimmed !== '' && !isNaN(trimmed)) return Number(trimmed);
                return trimmed;
            });
        }
        
        if (action === 'playIndividualSong') {
            fn(args[0], el);
        } else {
            fn(...args);
        }
    }
});

// Global keydown listener for keyboard accessibility on custom interactive elements (divs/spans)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const el = e.target.closest('[role="button"], [data-action]:not([role="radio"])');
        if (el && !['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
            e.preventDefault();
            el.click();
        }
    }
});


// === WO3: Keyboard accessibility ===
// ============================================================
// FOCUS TRAP — Erişilebilirlik
// Modal açıkken Tab/Shift+Tab odağı modal dışına kaçmaz.
// Escape tuşu modali kapatır.
// ============================================================
const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details > summary'
].join(', ');

const MODAL_IDS = ['roleOverlay', 'expOverlay', 'dashboardOverlay'];

function getActiveModal() {
    return MODAL_IDS
        .map(id => document.getElementById(id))
        .find(el => el && (el.classList.contains('active') || el.style.display === 'flex'));
}

document.addEventListener('keydown', (e) => {
    // ── Escape: aktif modali kapat ──
    if (e.key === 'Escape') {
        const modal = getActiveModal();
        if (!modal) return;
        const id = modal.id;
        if (id === 'dashboardOverlay') toggleInteractiveDashboard();
        else if (id === 'expOverlay')   closeExperience();
        // roleOverlay Escape ile kapatilmaz (zorunlu secim ekrani)
        return;
    }

    // Tab / Shift+Tab: odagi modal icinde tut
    if (e.key === 'Tab') {
        const modal = getActiveModal();
        if (!modal) return;

        const focusables = Array.from(modal.querySelectorAll(FOCUSABLE))
            .filter(el => !el.closest('[hidden]') && el.offsetParent !== null);

        if (focusables.length === 0) { e.preventDefault(); return; }

        const first = focusables[0];
        const last  = focusables[focusables.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || !modal.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last || !modal.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        }
    }
}, true);

// MutationObserver ile .active sinifi degisiminde aria-hidden guncelle
const _modalObserver = new MutationObserver(() => {
    const MIDS = ['roleOverlay', 'expOverlay', 'dashboardOverlay'];
    MIDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const isOpen = el.classList.contains('active') || el.style.display === 'flex';
        el.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });
    const anyOpen = MIDS.some(id => {
        const el = document.getElementById(id);
        return el && (el.classList.contains('active') || el.style.display === 'flex');
    });
    const bg = document.querySelector('.poster-container') || document.querySelector('main');
    if (bg) bg.setAttribute('aria-hidden', anyOpen ? 'true' : 'false');
});

document.addEventListener('DOMContentLoaded', () => {
    const MIDS = ['roleOverlay', 'expOverlay', 'dashboardOverlay'];
    MIDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.setAttribute('role', 'dialog');
            el.setAttribute('aria-modal', 'true');
            _modalObserver.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
        }
    });
    const expEl = document.getElementById('expOverlay');
    if (expEl) expEl.setAttribute('aria-hidden', 'true');
});

// ============================================================
// LIKERT SCROLL HINT — scrolled-end sinifi ile fade/ok gizlenir
// ============================================================
function initLikertScrollHints() {
    document.querySelectorAll('.likert-scale').forEach(function(scale) {
        var group = scale.closest('.likert-group');
        if (!group) return;
        function checkScroll() {
            var atEnd = scale.scrollLeft + scale.clientWidth >= scale.scrollWidth - 4;
            group.classList.toggle('scrolled-end', atEnd);
        }
        scale.addEventListener('scroll', checkScroll, { passive: true });
        setTimeout(checkScroll, 150); // tum elemanlar sigiyorsa ipucunu gizle
    });
}

document.addEventListener('DOMContentLoaded', initLikertScrollHints);

// expOverlay acildiginda Likert'leri yeniden baslat
document.addEventListener('DOMContentLoaded', function() {
    var expEl = document.getElementById('expOverlay');
    if (!expEl) return;
    var obs = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            if (m.target.classList.contains('active')) {
                setTimeout(initLikertScrollHints, 250);
            }
        });
    });
    obs.observe(expEl, { attributes: true, attributeFilter: ['class'] });
});
