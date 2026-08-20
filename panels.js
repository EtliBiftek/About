document.getElementById('dynamicPanels').innerHTML = `
<section class="native-panel" id="cs2Panel">
  <div class="native-panel-inner">
    <div class="native-panel-kicker">Counter Strike 2 · PIFO</div>
    <h2>CS2 Ayarlarım</h2>
    <p class="native-panel-lead">Kullandığım temel mouse, görüntü ve oyun ayarları. Değerler tek dosyanın içinde tutuluyor.</p>

    <div class="settings-group">
      <div class="settings-group-head"><span>01</span><h3>Crosshair</h3></div>
      <div class="code-box" id="crosshairCodeInline">CSGO-V7KbW-JcOtu-ZTRNK-oOTAE-QSDND</div>
      <button class="copy-inline" id="copyCrosshairInline">Kodu kopyala</button>
    </div>

    <div class="settings-group">
      <div class="settings-group-head"><span>02</span><h3>Mouse</h3></div>
      <div class="settings-grid-inline">
        <div class="setting-inline"><span class="name">DPI</span><span class="value">6400</span></div>
        <div class="setting-inline"><span class="name">Sensitivity</span><span class="value">0.22</span></div>
        <div class="setting-inline"><span class="name">eDPI</span><span class="value">1408</span></div>
        <div class="setting-inline"><span class="name">Zoom Sens</span><span class="value">1</span></div>
        <div class="setting-inline"><span class="name">Polling Rate</span><span class="value">1000 Hz</span></div>
        <div class="setting-inline"><span class="name">m_yaw</span><span class="value">0.022</span></div>
        <div class="setting-inline"><span class="name">Windows Sens</span><span class="value">3</span></div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-head"><span>03</span><h3>Görüntü</h3></div>
      <div class="settings-grid-inline">
        <div class="setting-inline"><span class="name">Çözünürlük</span><span class="value">1280×960</span></div>
        <div class="setting-inline"><span class="name">En-boy oranı</span><span class="value">4:3</span></div>
        <div class="setting-inline"><span class="name">Scaling Mode</span><span class="value">Stretched</span></div>
        <div class="setting-inline"><span class="name">Display Mode</span><span class="value">Fullscreen</span></div>
        <div class="setting-inline"><span class="name">Refresh Rate</span><span class="value">240 Hz</span></div>
        <div class="setting-inline"><span class="name">Brightness</span><span class="value">106%</span></div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-head"><span>04</span><h3>Grafik Ayarları</h3></div>
      <div class="settings-grid-inline">
        <div class="setting-inline"><span class="name">Boost Player Contrast</span><span class="value">Enabled</span></div>
        <div class="setting-inline"><span class="name">Vertical Sync</span><span class="value">Disabled</span></div>
        <div class="setting-inline"><span class="name">MSAA</span><span class="value">4x MSAA</span></div>
        <div class="setting-inline"><span class="name">Global Shadows</span><span class="value">Low</span></div>
        <div class="setting-inline"><span class="name">Texture / Model Detail</span><span class="value">Very High</span></div>
        <div class="setting-inline"><span class="name">Texture Filtering</span><span class="value">Anisotropic 2X</span></div>
        <div class="setting-inline"><span class="name">Shader Detail</span><span class="value">Low</span></div>
        <div class="setting-inline"><span class="name">Particle Detail</span><span class="value">Low</span></div>
        <div class="setting-inline"><span class="name">Ambient Occlusion</span><span class="value">Disabled</span></div>
        <div class="setting-inline"><span class="name">HDR</span><span class="value">Quality</span></div>
        <div class="setting-inline"><span class="name">FidelityFX Super Resolution</span><span class="value">Disabled</span></div>
        <div class="setting-inline"><span class="name">NVIDIA Reflex</span><span class="value">Enabled + Boost</span></div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-head"><span>05</span><h3>NVIDIA</h3></div>
      <div class="settings-grid-inline">
        <div class="setting-inline"><span class="name">Contrast</span><span class="value">105</span></div>
        <div class="setting-inline"><span class="name">Gamma</span><span class="value">1.1</span></div>
        <div class="setting-inline"><span class="name">Digital Vibrance</span><span class="value">90</span></div>
      </div>
    </div>
  </div>
</section>

<section class="native-panel" id="pcPanel">
  <div class="native-panel-inner">
    <div class="native-panel-kicker">Sistem · PIFO</div>
    <h2>Bilgisayar Parçalarım</h2>
    <p class="native-panel-lead">Kullandığım ana sistem bileşenleri. Kartlara tıklarsan ürün sayfaları yeni sekmede açılır.</p>

    <div class="parts-grid-inline">
      <a class="part-inline" href="https://www.amazon.de/Gigabyte-GeForce-3070-Gaming-Grafikkarte/dp/B08KHL21CV" target="_blank" rel="noopener"><div class="cat">GPU</div><div class="part-name-inline">Gigabyte GeForce RTX 3070 Gaming OC 8G</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.com/AMD-5600-12-Thread-Unlocked-Processor/dp/B09VCHR1VH" target="_blank" rel="noopener"><div class="cat">CPU</div><div class="part-name-inline">AMD Ryzen 5 5600</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.co.uk/Gigabyte-B550-GAMING-V2-Motherboard/dp/B08K16S4K1" target="_blank" rel="noopener"><div class="cat">Anakart</div><div class="part-name-inline">Gigabyte B550 Gaming X V2</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.com/Lexar-3200MT-Desktop-Heatsink-LD4U08G32C16LG-RUD/dp/B0CGR5WY8R" target="_blank" rel="noopener"><div class="cat">RAM</div><div class="part-name-inline">Lexar Thor 16GB (2×8GB) 3200MHz DDR4</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.co.uk/goodram-PX600-1000GB-PCIe-2280/dp/B0CB1QBGXW" target="_blank" rel="noopener"><div class="cat">M.2 SSD 1</div><div class="part-name-inline">Goodram PX600 1TB NVMe M.2 SSD</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.co.uk/goodram-PX600-1000GB-PCIe-2280/dp/B0CB1QBGXW" target="_blank" rel="noopener"><div class="cat">M.2 SSD 2</div><div class="part-name-inline">Goodram PX600 1TB NVMe M.2 SSD</div><div class="part-link-inline">Ürünü incele</div></a>
      <a class="part-inline" href="https://www.amazon.com/s?k=Thermalright+Assassin+X+120+R+Digital+ARGB" target="_blank" rel="noopener"><div class="cat">İşlemci Soğutucu</div><div class="part-name-inline">Thermalright Assassin X 120 R Digital ARGB</div><div class="part-link-inline">Ürünü incele</div></a>
    </div>
  </div>
</section>

<section class="ataturk-panel" id="ataturkPanel">
  <div class="ataturk-panel-inner">
    <div class="ataturk-panel-kicker">Mustafa Kemal Atatürk · 1881 — 1938</div>
    <h2>Bir imparatorluğun sonundan<br>bir Cumhuriyetin kuruluşuna.</h2>
    <p class="ataturk-panel-lead">Mustafa Kemal Atatürk; asker, devlet adamı, düşünce ve reform insanı, Türkiye Cumhuriyeti'nin kurucusu ve ilk Cumhurbaşkanıdır. Hayatı yalnızca savaş meydanlarından ibaret değildir; eğitimden hukuka, ekonomiden kültüre, kadın haklarından dil ve tarih çalışmalarına kadar Türkiye'nin modernleşme sürecinin merkezinde yer almıştır.</p>
    <div class="ataturk-facts">
      <article class="ataturk-fact"><div class="ataturk-fact-year">1881</div><strong>Selanik'te doğdu</strong><p>Mustafa, Ali Rıza Efendi ile Zübeyde Hanım'ın çocuğu olarak Selanik'te dünyaya geldi. Çok kültürlü bir liman şehri olan Selanik, onun erken yaşta farklı fikirlerle karşılaşmasına ortam hazırladı.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1890'lar</div><strong>Askerî eğitime yöneldi</strong><p>Selanik Askerî Rüştiyesi'nde matematik öğretmeninin verdiği “Kemal” adıyla Mustafa Kemal olarak anılmaya başladı. Manastır Askerî İdadisi, Harp Okulu ve Harp Akademisi eğitimleri onu kurmay subaylığa hazırladı.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1905</div><strong>Kurmay Yüzbaşı</strong><p>Harp Akademisi'nden mezun oldu. Şam'daki 5. Ordu'da göreve başladı. Osmanlı İmparatorluğu'nun siyasî ve askerî sorunlarını sahada gözlemledi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1911 — 1912</div><strong>Trablusgarp</strong><p>İtalyan işgaline karşı bölgede yerel direnişin örgütlenmesinde görev aldı. Tobruk ve Derne çevresindeki faaliyetleri, onun savaş alanındaki ilk önemli deneyimleri arasındadır.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1915</div><strong>Çanakkale</strong><p>19. Tümen komutanı olarak Arıburnu, Conkbayırı ve Anafartalar'da kritik sorumluluklar üstlendi. Çanakkale, onun Osmanlı kamuoyunda geniş ölçekte tanınmasını sağlayan dönüm noktası oldu.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1916 — 1918</div><strong>Doğu ve Suriye cepheleri</strong><p>Kafkas Cephesi'nde Muş ve Bitlis'in geri alınmasında görev aldı; ardından Suriye-Filistin hattında üst düzey komutanlık yaptı. Savaşın sonunda Osmanlı'nın askerî ve siyasî durumunu yakından değerlendirdi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">19 Mayıs 1919</div><strong>Samsun'a çıkış</strong><p>9. Ordu Müfettişi olarak Samsun'a çıktı. Bu tarih, Millî Mücadele'nin örgütlü başlangıcının sembolü kabul edilir.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1919</div><strong>Amasya · Erzurum · Sivas</strong><p>Amasya Genelgesi ile millî egemenlik fikrini açık biçimde ortaya koydu. Erzurum ve Sivas kongrelerinde bölgesel direnişlerin ortak bir millî hareket altında birleşmesine öncülük etti.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">23 Nisan 1920</div><strong>Türkiye Büyük Millet Meclisi</strong><p>Ankara'da TBMM açıldı. Mustafa Kemal Meclis Başkanı seçildi. Böylece Millî Mücadele, meşruiyetini temsilî bir meclis üzerinden yürütmeye başladı.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1921</div><strong>Sakarya Meydan Muharebesi</strong><p>Başkomutan olarak ordunun sevk ve idaresinde belirleyici rol oynadı. Zaferden sonra kendisine Mareşal rütbesi ve Gazi unvanı verildi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">26 Ağustos — 9 Eylül 1922</div><strong>Büyük Taarruz</strong><p>Başkomutanlık Meydan Muharebesi ile Yunan ordusunun ana kuvvetleri yenildi; Türk ordusu İzmir'e ulaştı. Askerî mücadele fiilen sonuçlandı.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">24 Temmuz 1923</div><strong>Lozan Antlaşması</strong><p>Yeni Türk devletinin uluslararası alandaki egemenliği ve sınırlarının büyük bölümü Lozan Barış Antlaşması ile tanındı.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">29 Ekim 1923</div><strong>Cumhuriyet ilan edildi</strong><p>Türkiye Cumhuriyeti ilan edildi ve Mustafa Kemal ilk Cumhurbaşkanı seçildi. Devlet yapısının merkezine millî egemenlik ilkesi yerleştirildi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1924 — 1937</div><strong>Reformlar dönemi</strong><p>Eğitim birliği, hukuk sisteminin laikleştirilmesi, yeni Türk harfleri, ölçü ve takvim düzenlemeleri, kadınların siyasî hakları, üniversite reformu ve ekonomik kurumlaşma gibi geniş çaplı dönüşümler hayata geçirildi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">1934</div><strong>Atatürk soyadı</strong><p>Soyadı Kanunu'nun ardından Türkiye Büyük Millet Meclisi tarafından Mustafa Kemal'e “Atatürk” soyadı verildi.</p></article>
      <article class="ataturk-fact"><div class="ataturk-fact-year">10 Kasım 1938</div><strong>Dolmabahçe Sarayı</strong><p>İstanbul'da Dolmabahçe Sarayı'nda hayatını kaybetti. 1953'ten bu yana naaşı Ankara'daki Anıtkabir'de bulunmaktadır.</p></article>
    </div>
    <div class="ataturk-longform">
      <section class="ataturk-topic"><span>01</span><div><h3>Millî egemenlik anlayışı</h3><p>Atatürk'ün siyasî düşüncesinin temelinde, devlet yönetiminin meşruiyetinin hanedan veya kişisel iktidardan değil millet iradesinden gelmesi gerektiği fikri bulunur. “Egemenlik kayıtsız şartsız milletindir” ilkesi bu anlayışın en kısa ifadesidir. TBMM'nin açılması, Cumhuriyetin ilanı ve saltanatın kaldırılması bu dönüşümün kurumsal adımlarıdır.</p></div></section>
      <section class="ataturk-topic"><span>02</span><div><h3>Eğitim, bilim ve akıl</h3><p>Atatürk, çağdaşlaşmanın kalıcı olabilmesi için eğitimin merkezî önem taşıdığına inanıyordu. Tevhid-i Tedrisat Kanunu ile eğitim sistemi birleştirildi. Yeni Türk harflerinin kabulüyle okuryazarlığın yaygınlaştırılması hedeflendi. Üniversite reformları, yurt dışından bilim insanlarının Türkiye'ye davet edilmesi ve modern akademik kurumların güçlendirilmesi bu yaklaşımın devamıydı.</p></div></section>
      <section class="ataturk-topic"><span>03</span><div><h3>Hukuk ve toplumsal dönüşüm</h3><p>1920'ler ve 1930'larda şer'i ve çok hukuklu yapıdan laik hukuk sistemine geçiş yönünde kapsamlı değişiklikler yapıldı. Türk Medeni Kanunu'nun kabulü; evlilik, boşanma, miras ve aile hukuku alanlarında önemli dönüşümler yarattı. Kadınların belediye seçimlerinden başlayarak milletvekili seçme ve seçilme hakkına uzanan siyasî hakları genişletildi.</p></div></section>
      <section class="ataturk-topic"><span>04</span><div><h3>Ekonomi ve devletin yeniden kuruluşu</h3><p>Cumhuriyetin ilk yıllarında ekonomik bağımsızlık, siyasî bağımsızlığın tamamlayıcısı olarak görüldü. İzmir İktisat Kongresi, millî bankacılık girişimleri, demiryollarının geliştirilmesi ve 1930'larda uygulanan devletçilik politikaları; sanayileşme ve altyapı yatırımlarının hızlandırılmasını amaçladı.</p></div></section>
      <section class="ataturk-topic"><span>05</span><div><h3>Dış politika</h3><p>Atatürk döneminin dış politikası, bağımsızlık ve karşılıklı egemenliğe saygı ilkeleri etrafında şekillendi. Balkan Antantı ve Sadabat Paktı gibi bölgesel iş birliği girişimleriyle barışçı denge siyaseti izlendi. Montrö Boğazlar Sözleşmesi ile Türkiye'nin Boğazlar üzerindeki egemenliği güçlendirildi. Hatay meselesi ise Atatürk'ün son döneminin en önemli diplomatik gündemlerinden biri oldu.</p></div></section>
      <section class="ataturk-topic"><span>06</span><div><h3>Kültür, tarih ve dil</h3><p>Türk Tarih Kurumu ve Türk Dil Kurumu'nun kurulması, ulusal kimliğin tarihsel ve kültürel temellerini araştırma isteğinin sonucuydu. Atatürk; sanat, müzik, tiyatro, arkeoloji ve müzeciliği modern toplumun ayrılmaz parçaları olarak görüyordu. Cumhuriyet kültür politikası yalnızca siyasî değil, aynı zamanda toplumsal ve kültürel bir yeniden yapılanmayı hedefliyordu.</p></div></section>
      <section class="ataturk-topic"><span>07</span><div><h3>Kişisel çalışma disiplini</h3><p>Yakın çevresinin anıları, Atatürk'ün yoğun okuma alışkanlığına, uzun çalışma saatlerine ve meseleleri farklı uzmanlarla tartışma eğilimine dikkat çeker. Askerî tarih, siyaset, hukuk, ekonomi, sosyoloji, dil ve tarih gibi çok farklı alanlarda kitaplar okudu; çeşitli kitaplara el yazısıyla notlar düştü.</p></div></section>
      <section class="ataturk-topic"><span>08</span><div><h3>Mirası</h3><p>Atatürk'ün bıraktığı en kalıcı miras, Türkiye Cumhuriyeti'nin kurumsal temelleri ve modernleşme yönelimidir. Onun fikirleri ve uygulamaları bugün de tarih, siyaset, toplum ve kültür alanlarında tartışılmaya ve araştırılmaya devam eder. Türkiye'deki kamusal hafızada bağımsızlık mücadelesinin ve Cumhuriyetin kuruluşunun merkezi figürüdür.</p></div></section>
    </div>
    <div class="ataturk-documents">
      <section class="document-block"><div class="document-label">İstiklal Marşı</div><h3>Mehmet Âkif Ersoy</h3><div class="document-text">
        <p>Korkma, sönmez bu şafaklarda yüzen al sancak;<br>Sönmeden yurdumun üstünde tüten en son ocak.<br>O benim milletimin yıldızıdır, parlayacak;<br>O benimdir, o benim milletimindir ancak.</p>
        <p>Çatma, kurban olayım çehreni ey nazlı hilâl!<br>Kahraman ırkıma bir gül! Ne bu şiddet bu celâl?<br>Sana olmaz dökülen kanlarımız sonra helâl,<br>Hakkıdır, Hakk'a tapan, milletimin istiklâl.</p>
        <p>Ben ezelden beridir hür yaşadım, hür yaşarım.<br>Hangi çılgın bana zincir vuracakmış? Şaşarım!<br>Kükremiş sel gibiyim; bendimi çiğner, aşarım;<br>Yırtarım dağları, enginlere sığmam, taşarım.</p>
        <p>Garb'ın âfâkını sarmışsa çelik zırhlı duvar;<br>Benim iman dolu göğsüm gibi serhaddim var.<br>Ulusun, korkma! Nasıl böyle bir imanı boğar,<br>“Medeniyet!” dediğin tek dişi kalmış canavar?</p>
        <p>Arkadaş! Yurduma alçakları uğratma sakın;<br>Siper et gövdeni, dursun bu hayâsızca akın.<br>Doğacaktır sana va'dettiği günler Hakk'ın;<br>Kim bilir, belki yarın, belki yarından da yakın.</p>
        <p>Bastığın yerleri “toprak!” diyerek geçme, tanı!<br>Düşün altındaki binlerce kefensiz yatanı.<br>Sen şehîd oğlusun, incitme, yazıktır atanı;<br>Verme, dünyaları alsan da, bu cennet vatanı.</p>
        <p>Kim bu cennet vatanın uğruna olmaz ki fedâ?<br>Şühedâ fışkıracak, toprağı sıksan şühedâ!<br>Cânı, cânânı, bütün varımı alsın da Hudâ,<br>Etmesin tek vatanımdan beni dünyada cüdâ.</p>
        <p>Ruhumun senden, İlâhî, şudur ancak emeli:<br>Değmesin ma'bedimin göğsüne nâ-mahrem eli!<br>Bu ezanlar-ki şehâdetleri dinin temeli-<br>Ebedî yurdumun üstünde benim inlemeli.</p>
        <p>O zaman vecd ile bin secde eder-varsa-taşım;<br>Her cerîhamdan, İlâhî, boşanıp kanlı yaşım,<br>Fışkırır rûh-i mücerred gibi yerden na'şım;<br>O zaman yükselerek Arş'a değer, belki başım.</p>
        <p>Dalgalan sen de şafaklar gibi ey şanlı hilâl!<br>Olsun artık dökülen kanlarımın hepsi helâl.<br>Ebediyen sana yok, ırkıma yok izmihlâl:<br>Hakkıdır, hür yaşamış, bayrağımın hürriyet;<br>Hakkıdır, Hakk'a tapan, milletimin istiklâl!</p>
      </div></section>
      <section class="document-block"><div class="document-label">Gençliğe Hitabe</div><h3>Mustafa Kemal Atatürk</h3><div class="document-text">
        <p>Ey Türk gençliği! Birinci vazifen, Türk istiklâlini, Türk Cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir.</p>
        <p>Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir. İstikbalde dahi, seni bu hazineden mahrum etmek isteyecek, dâhilî ve haricî bedhahların olacaktır. Bir gün, istiklâl ve Cumhuriyeti müdafaa mecburiyetine düşersen, vazifeye atılmak için, içinde bulunacağın vaziyetin imkân ve şeraitini düşünmeyeceksin! Bu imkân ve şerait, çok namüsait bir mahiyette tezahür edebilir. İstiklâl ve Cumhuriyetine kastedecek düşmanlar, bütün dünyada emsali görülmemiş bir galibiyetin mümessili olabilirler. Cebren ve hile ile aziz vatanın bütün kaleleri zapt edilmiş, bütün tersanelerine girilmiş, bütün orduları dağıtılmış ve memleketin her köşesi bilfiil işgal edilmiş olabilir.</p>
        <p>Bütün bu şeraitten daha elîm ve daha vahim olmak üzere, memleketin dâhilinde iktidara sahip olanlar gaflet ve dalâlet ve hattâ hıyanet içinde bulunabilirler. Hattâ bu iktidar sahipleri şahsî menfaatlerini, müstevlîlerin siyasî emelleriyle tevhit edebilirler. Millet, fakr ü zaruret içinde harap ve bîtap düşmüş olabilir.</p>
        <p>Ey Türk istikbalinin evlâdı! İşte, bu ahval ve şerait içinde dahi, vazifen; Türk istiklâl ve Cumhuriyetini kurtarmaktır! Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!</p>
      </div></section>
    </div>
  </div>
</section>
`;