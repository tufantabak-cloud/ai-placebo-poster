import sys

def process():
    # Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    replacements = {
        'This section explains the logic behind the fNIRS preprocessing and analysis choices. It is included for transparency and methodological clarity; no analysis scripts are provided on this website. The fNIRS results remain exploratory.':
        '<span data-i18n="a-materials-intro">This section explains the logic behind the fNIRS preprocessing and analysis choices. It is included for transparency and methodological clarity; no analysis scripts are provided on this website. The fNIRS results remain exploratory.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">A. What was analyzed?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa1-t">A. What was analyzed?</h3>',

        'Raw fNIRS exports were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). The primary neural summary focused on HbO2 Peak in Right and Left PFC ROIs because HbO is commonly used in task-based fNIRS and often shows stronger task-related response amplitude.':
        '<span data-i18n="a-materials-qa1-a">Raw fNIRS exports were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). The primary neural summary focused on HbO2 Peak in Right and Left PFC ROIs because HbO is commonly used in task-based fNIRS and often shows stronger task-related response amplitude.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">B. How was the signal cleaned?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa2-t">B. How was the signal cleaned?</h3>',

        'Signals were filtered using a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to reduce slow drift and higher-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations.':
        '<span data-i18n="a-materials-qa2-a">Signals were filtered using a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to reduce slow drift and higher-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">C. How was baseline handled?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa3-t">C. How was baseline handled?</h3>',

        'A local trial-level baseline was defined as the −10 to 0 s interval before label reveal. This local pre-label baseline captures the participant’s hemodynamic state immediately before the source attribution appears and helps control trial-to-trial drift.':
        '<span data-i18n="a-materials-qa3-a">A local trial-level baseline was defined as the −10 to 0 s interval before label reveal. This local pre-label baseline captures the participant’s hemodynamic state immediately before the source attribution appears and helps control trial-to-trial drift.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">D. How was the response quantified?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa4-t">D. How was the response quantified?</h3>',

        'After label reveal, HbO2 Peak was extracted from a literature-informed post-label HRF response window for each trial and ROI. The analysis focused on Right PFC and Left PFC to test whether the AI-label pattern was right-lateralized.':
        '<span data-i18n="a-materials-qa4-a">After label reveal, HbO2 Peak was extracted from a literature-informed post-label HRF response window for each trial and ROI. The analysis focused on Right PFC and Left PFC to test whether the AI-label pattern was right-lateralized.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">E. How were conditions compared?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa5-t">E. How were conditions compared?</h3>',

        'For each participant, AI-labeled and Human-labeled trials were averaged separately. AI − Human difference scores were tested at the participant level. The printed poster additionally reports a secondary trial-level LME sensitivity model with participant as a random intercept.':
        '<span data-i18n="a-materials-qa5-a">For each participant, AI-labeled and Human-labeled trials were averaged separately. AI − Human difference scores were tested at the participant level. The printed poster additionally reports a secondary trial-level LME sensitivity model with participant as a random intercept.</span>',

        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;">F. Why is this exploratory?</h3>':
        '<h3 style="font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;" data-i18n="a-materials-qa6-t">F. Why is this exploratory?</h3>',

        'The retained fNIRS sample was small (n = 13) and participant/channel exclusion was substantial. Therefore, fNIRS findings are interpreted as preliminary neural evidence and require replication. Behavioral findings from the full N = 30 sample are the stronger evidence in this thesis.':
        '<span data-i18n="a-materials-qa6-a">The retained fNIRS sample was small (n = 13) and participant/channel exclusion was substantial. Therefore, fNIRS findings are interpreted as preliminary neural evidence and require replication. Behavioral findings from the full N = 30 sample are the stronger evidence in this thesis.</span>',

        'Your result is based only on your ratings in this demo. It does not measure your brain activity.':
        '<span data-i18n="exp-disclaimer">Your result is based only on your ratings in this demo. It does not measure your brain activity.</span>'
    }

    for k, v in replacements.items():
        if k in html:
            html = html.replace(k, v)
        else:
            print(f"Warning: String not found in index.html:\n{k}")

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    # Update script.js
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js_to_add = """
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
"""
    if 'a-materials-qa6-t' not in js:
        js = js.replace('const translations = {\n', 'const translations = {\n' + js_to_add)
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js)
    
if __name__ == '__main__':
    process()
    print("Done")
