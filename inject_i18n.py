import json

new_translations = {
  "v-what-else-title": {
    "en": "What Else Did We Notice?",
    "tr": "Başka Ne Fark Ettik?"
  },
  "v-what-else-subtitle": {
    "en": "The biggest surprise was that people did not simply dislike AI music. Instead, the AI label changed specific judgments. People were more likely to question whether the music felt trustworthy, authentic, high-quality, or emotionally meaningful. Liking was more protected.",
    "tr": "En büyük sürpriz insanların YZ müziğinden sadece nefret etmemesiydi. Bunun yerine, YZ etiketi belirli yargıları değiştirdi. İnsanlar müziğin güvenilir, otantik, yüksek kaliteli veya duygusal olarak anlamlı hissettirip hissettirmediğini sorgulamaya daha meyilliydi. Beğeni ise daha korunmuştu."
  },
  "v-what-else-1-title": {
    "en": "Trust changed most",
    "tr": "En çok Güven değişti"
  },
  "v-what-else-1-text": {
    "en": "AI labels mainly affected whether people trusted the music as meaningful or reliable.",
    "tr": "YZ etiketleri temel olarak insanların müziği anlamlı veya güvenilir bulup bulmadığını etkiledi."
  },
  "v-what-else-2-title": {
    "en": "Genre mattered",
    "tr": "Tür önemliydi"
  },
  "v-what-else-2-text": {
    "en": "Arabesque was more sensitive to AI labeling, while Electronic music sometimes made the AI label feel more fitting.",
    "tr": "Arabesk, YZ etiketine daha duyarlıyken, Elektronik müzik bazen YZ etiketinin daha uygun hissettirmesine neden oldu."
  },
  "v-what-else-3-title": {
    "en": "Liking is not the whole story",
    "tr": "Sadece beğenmek her şey demek değildir"
  },
  "v-what-else-3-text": {
    "en": "People can enjoy a song while still judging it as less authentic or less emotionally human.",
    "tr": "İnsanlar bir şarkıdan keyif alırken bile onu daha az otantik veya daha az insani duygular barındıran bir eser olarak değerlendirebiliyor."
  },
  "v-what-else-disclaimer": {
    "en": "These are behavioral patterns from the study sample. They do not mean every listener reacts the same way.",
    "tr": "Bunlar çalışma örnekleminden elde edilen davranışsal kalıplardır. Her dinleyicinin aynı şekilde tepki verdiği anlamına gelmez."
  },
  "a-explore-beh-title": {
    "en": "Exploratory Behavioral Findings",
    "tr": "Keşfedici Davranışsal Bulgular"
  },
  "a-explore-beh-subtitle": {
    "en": "Beyond the main label effects, the behavioral data suggested several genre- and dimension-specific patterns.",
    "tr": "Temel etiket etkilerinin ötesinde, davranışsal veriler müzik türüne ve değerlendirme boyutuna özgü birkaç kalıp öne sürmüştür."
  },
  "a-explore-beh-1-title": {
    "en": "1. Trust was the most label-sensitive judgment",
    "tr": "1. Güven, etikete en duyarlı yargıydı"
  },
  "a-explore-beh-1-text": {
    "en": "Among the rating dimensions, Trust appeared especially sensitive to source labeling. AI labels reduced trust more strongly than basic liking, suggesting that AI attribution primarily affects perceived agency and reliability rather than simple enjoyment. Trust showed a strong label-related effect, η²p = .339, p < .001.",
    "tr": "Değerlendirme boyutları arasında Güven, kaynak etiketlemesine özellikle duyarlı görünmüştür. YZ etiketleri güveni basit beğeniden daha güçlü bir şekilde azaltmıştır; bu da YZ atfının basit bir keyif almaktan ziyade öncelikle algılanan eylemliliği ve güvenilirliği etkilediğini göstermektedir. Güven, güçlü bir etiketle ilişkili etki göstermiştir, η²p = .339, p < .001."
  },
  "a-explore-beh-2-title": {
    "en": "2. The AI penalty was selective, not global",
    "tr": "2. YZ cezası genel değil, seçiciydi"
  },
  "a-explore-beh-2-text": {
    "en": "Participants did not simply dislike AI-labeled music across all dimensions. The AI label mainly affected higher-order judgments such as Trust, Authenticity, Quality, and Emotional Investment, while Liking was comparatively more preserved.",
    "tr": "Katılımcılar tüm boyutlarda YZ etiketli müzikten nefret etmediler. YZ etiketi temel olarak Güven, Otantiklik, Kalite ve Duygusal Yatırım gibi üst düzey yargıları etkilerken, Beğeni görece daha fazla korunmuştur."
  },
  "a-explore-beh-3-title": {
    "en": "3. Genre changed the meaning of the AI label",
    "tr": "3. Tür, YZ etiketinin anlamını değiştirdi"
  },
  "a-explore-beh-3-text": {
    "en": "The effect of the AI label depended on genre. Arabesque showed a stronger AI-label penalty, Blues appeared more label-invariant or weaker, and Electronic music showed a weaker or partially reversed AI penalty, consistent with genre-label congruency. Trust (Human − AI): Arabesque +1.14, Blues +0.10, Electronic −1.32. This suggests that AI attribution is not a universal bias; it depends on whether the label fits the cultural and acoustic expectations of the genre.",
    "tr": "YZ etiketinin etkisi türe bağlıydı. Arabesk daha güçlü bir YZ etiketi cezası gösterdi, Blues daha fazla etiket bağımsız veya zayıf göründü ve Elektronik müzik tür-etiket uyumuyla tutarlı olarak daha zayıf veya kısmen tersine dönmüş bir YZ cezası gösterdi. Güven (İnsan − YZ): Arabesk +1.14, Blues +0.10, Elektronik −1.32. Bu, YZ atfının evrensel bir yanlılık olmadığını; etiket ile türün kültürel ve akustik beklentilerinin uyuşup uyuşmamasına bağlı olduğunu göstermektedir."
  },
  "a-explore-beh-4-title": {
    "en": "4. Arabesque showed cultural sensitivity to AI labeling",
    "tr": "4. Arabesk, YZ etiketlemesine kültürel hassasiyet gösterdi"
  },
  "a-explore-beh-4-text": {
    "en": "Arabesque appeared especially sensitive to AI labeling. Because it is culturally and emotionally loaded, the AI label may have conflicted with expectations of human expression, lived experience, and cultural authenticity.",
    "tr": "Arabesk, YZ etiketlemesine karşı özellikle duyarlı görünmüştür. Kültürel ve duygusal olarak yüklü olduğu için, YZ etiketi insan ifadesi, yaşanmışlık ve kültürel otantiklik beklentileriyle çatışmış olabilir."
  },
  "a-explore-beh-5-title": {
    "en": "5. Electronic music showed possible label congruency",
    "tr": "5. Elektronik müzik olası bir etiket uyumu gösterdi"
  },
  "a-explore-beh-5-text": {
    "en": "Electronic music showed a weaker or partially reversed AI penalty. This may reflect genre-label congruency: listeners may perceive algorithmic or technological production as more compatible with electronic music than with culturally rooted acoustic genres.",
    "tr": "Elektronik müzik, daha zayıf veya kısmen tersine dönmüş bir YZ cezası gösterdi. Bu durum, tür-etiket uyumunu yansıtıyor olabilir: dinleyiciler algoritmik veya teknolojik üretimi, kültürel kökenli akustik türlere kıyasla elektronik müzikle daha uyumlu algılıyor olabilir."
  },
  "a-explore-beh-6-title": {
    "en": "6. Actual producer and displayed label came apart",
    "tr": "6. Gerçek üretici ve gösterilen etiket birbirinden ayrıldı"
  },
  "a-explore-beh-6-text": {
    "en": "The design separated what the track actually was from what participants were told it was. This allowed the study to test whether evaluation followed the sound itself or the source attribution attached to it. The displayed source label was manipulated independently of actual producer.",
    "tr": "Araştırma deseni, parçanın gerçekte ne olduğu ile katılımcılara ne söylendiğini birbirinden ayırdı. Bu, değerlendirmenin sesin kendisini mi yoksa ona eklenen kaynak atfını mı takip ettiğini test etmeye olanak tanıdı. Gösterilen kaynak etiketi, gerçek üreticiden bağımsız olarak manipüle edildi."
  },
  "a-explore-beh-7-title": {
    "en": "7. Liking and authenticity dissociated",
    "tr": "7. Beğeni ve otantiklik ayrıştı"
  },
  "a-explore-beh-7-text": {
    "en": "One of the most important behavioral patterns was the dissociation between liking and authenticity. Participants could still like a piece of music while rating it as less authentic, less trustworthy, or less emotionally meaningful when it carried an AI label. This suggests that AI-label bias targets perceived human intention more than immediate pleasure.",
    "tr": "En önemli davranışsal kalıplardan biri beğeni ve otantiklik arasındaki ayrışmaydı. Katılımcılar YZ etiketi taşıyan bir müziği daha az otantik, daha az güvenilir veya duygusal olarak daha az anlamlı buldukları halde yine de beğenebilmişlerdir. Bu durum, YZ etiketi yanlılığının anlık zevkten ziyade algılanan insan niyetini hedef aldığını göstermektedir."
  },
  "a-materials-title": {
    "en": "fNIRS Analysis Logic & Literature Basis",
    "tr": "fNIRS Analiz Mantığı ve Literatür Temeli"
  },
  "a-method-fnirs-lit": {
    "en": "fNIRS preprocessing followed a transparent, literature-informed workflow. Raw .oxy files were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). Participant and file quality control was applied before inferential analysis. Retained signals were filtered with a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to attenuate slow drift and high-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations. A local trial-level baseline was computed from the −10 to 0 s interval before label reveal and subtracted from the post-label response. HbO2 Peak was then extracted from a 4–15 s post-label HRF response window for Right and Left PFC ROIs. This window was selected as a literature-informed sensitivity window to capture the delayed hemodynamic response after label onset. Because the retained fNIRS sample was small (n = 13), all neural analyses are reported as exploratory.",
    "tr": "fNIRS ön işlemesi şeffaf, literatüre dayalı bir akış izlemiştir. Ham .oxy dosyaları, oksijenli ve deoksijenli hemoglobin sinyalleri (HbO/HbO2 ve HbR/Deoxy) için incelenmiştir. Çıkarımsal analizden önce katılımcı ve dosya kalite kontrolü uygulanmıştır. Kalan sinyaller, göreve bağlı hemodinamik dalgalanmaları korurken yavaş sapmayı ve yüksek frekanslı fizyolojik/enstrümantal gürültüyü azaltmak için 0.01 ila 0.2 Hz'lik 4. dereceden sıfır fazlı Butterworth bant geçiren filtre ile filtrelenmiştir. Etiket gösterilmeden önceki −10 ila 0 sn aralığından deneme bazında yerel bir temel çizgi (baseline) hesaplanmış ve etiket sonrası yanıttan çıkarılmıştır. Ardından, Sağ ve Sol PFC ROI'leri için etiket sonrası 4-15 sn'lik İK (HRF) yanıt penceresinden Zirve HbO2 değeri elde edilmiştir. Bu pencere, etiket başlangıcından sonra gecikmiş hemodinamik yanıtı yakalamak için literatüre dayalı bir hassasiyet penceresi olarak seçilmiştir. Analize dahil edilen fNIRS örneklemi küçük (n = 13) olduğu için, tüm sinirsel analizler keşfedici (exploratory) olarak raporlanmıştır."
  },
  "a-method-q1": {
    "en": "Why HbO2 as the primary metric?",
    "tr": "Neden birincil ölçüm olarak HbO2?"
  },
  "a-method-a1": {
    "en": "Both HbO/HbO2 and HbR/Deoxy were inspected. Inferential analyses focused on HbO2 Peak because HbO is commonly used in task-based fNIRS and typically shows stronger task-related response amplitude, while HbR was treated as a complementary signal.",
    "tr": "Hem HbO/HbO2 hem de HbR/Deoxy incelenmiştir. Göreve dayalı fNIRS araştırmalarında yaygın olarak kullanıldığı ve tipik olarak göreve bağlı olarak daha güçlü bir yanıt genliği gösterdiği için çıkarımsal analizler HbO2 zirvesine odaklanırken, HbR tamamlayıcı bir sinyal olarak ele alınmıştır."
  },
  "a-method-q2": {
    "en": "Why 0.01–0.2 Hz filtering?",
    "tr": "Neden 0.01–0.2 Hz filtreleme?"
  },
  "a-method-a2": {
    "en": "This band-pass range is commonly used to reduce very slow drift and higher-frequency physiological/instrumental noise while retaining task-related hemodynamic fluctuations.",
    "tr": "Bu bant geçiren aralığı, göreve bağlı hemodinamik dalgalanmaları korurken, çok yavaş sapmaları ve daha yüksek frekanslı fizyolojik/enstrümantal gürültüyü azaltmak için yaygın olarak kullanılmaktadır."
  },
  "a-method-q3": {
    "en": "Why local baseline −10–0 s?",
    "tr": "Neden −10–0 sn yerel temel çizgi (baseline)?"
  },
  "a-method-a3": {
    "en": "A local pre-label baseline controls for trial-to-trial drift and captures the participant’s hemodynamic state immediately before the source label appears.",
    "tr": "Deneme öncesi yerel bir temel çizgi, denemeden denemeye sapmaları kontrol eder ve kaynak etiketi görünmeden hemen önceki katılımcının hemodinamik durumunu yakalar."
  },
  "a-method-q4": {
    "en": "Why 4–15 s HRF window?",
    "tr": "Neden 4–15 sn HRF penceresi?"
  },
  "a-method-a4": {
    "en": "fNIRS hemodynamic responses are delayed relative to stimulus onset. The 4–15 s window was used as a literature-informed sensitivity window to capture the expected rise and peak response after label reveal. It should be reported as exploratory/sensitivity analysis, not as a universal standard.",
    "tr": "fNIRS hemodinamik yanıtları, uyaran başlangıcına göre gecikmelidir. 4-15 sn penceresi, etiket gösteriminden sonra beklenen artışı ve zirve yanıtını yakalamak için literatüre dayalı bir duyarlılık penceresi olarak kullanılmıştır. Evrensel bir standart olarak değil, keşfedici/duyarlılık analizi olarak raporlanmalıdır."
  }
}

import re
with open('c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/script.js', 'r', encoding='utf8') as f:
    content = f.read()

# We will inject these right before `en: {` inside the translations object
insertion_point = content.find('en: {')
if insertion_point == -1:
    print("Could not find insertion point!")
    exit(1)

# Format the new translations
injection = ""
for key, val in new_translations.items():
    # JSON dump to escape quotes safely
    en_val = json.dumps(val['en'], ensure_ascii=False)
    tr_val = json.dumps(val['tr'], ensure_ascii=False)
    injection += f"    '{key}': {{ en: {en_val}, tr: {tr_val} }},\n"

# Insert the injection
new_content = content[:insertion_point] + injection + content[insertion_point:]

with open('c:/Users/Tufan TABAK/Desktop/academic pster/interactive_poster/script.js', 'w', encoding='utf8') as f:
    f.write(new_content)

print("Injected new translations.")
