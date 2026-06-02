import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

index_replacements = [
    (
        '''                <!-- ACADEMIC: Analysis Materials & Reproducibility -->
                <div class=\"card academic-only\">
                    <h2 data-i18n=\"a-materials-title\">Analysis Materials & Reproducibility</h2>
                    
                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; margin-top: 1.5rem;\" data-i18n=\"a-materials-a-title\">What the scripts include</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\" data-i18n=\"a-materials-a-text\">
                        The analysis scripts load raw .oxy and .mrk files, extract label events, preprocess HbO/HbR signals, apply participant/file quality control, perform local baseline correction, extract ROI-level HbO2 Peak metrics, and compute participant-level t-tests and trial-level LME models.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; margin-top: 1.5rem;\" data-i18n=\"a-materials-b-title\">What the scripts output</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\" data-i18n=\"a-materials-b-text\">
                        The scripts generate trial-level metrics, participant-level condition summaries, Right/Left PFC comparisons, and group-level statistical summaries. They are intended for reproducibility and transparency.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; margin-top: 1.5rem;\" data-i18n=\"a-materials-c-title\">Important transparency note</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\" data-i18n=\"a-materials-c-text\">
                        The fNIRS analyses are exploratory. The scripts reproduce the poster-consistent literature-informed sensitivity analysis. They should not be presented as preregistered confirmatory analyses.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; margin-top: 1.5rem;\" data-i18n=\"a-materials-d-title\">Download area</h3>
                    <div class=\"download-badges\" style=\"margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;\">
                        <a href=\"#\" class=\"dl-badge\" data-i18n=\"a-materials-dl-1\">📄 Download fNIRS preprocessing script (TODO)</a>
                        <a href=\"#\" class=\"dl-badge\" data-i18n=\"a-materials-dl-2\">📄 Download fNIRS analysis script (TODO)</a>
                        <a href=\"README_fNIRS_Analysis.md\" target=\"_blank\" class=\"dl-badge\" data-i18n=\"a-materials-dl-3\">📄 Download README / Methodological Notes</a>
                        <a href=\"#\" class=\"dl-badge\" data-i18n=\"a-materials-dl-4\">📊 Download output tables (TODO)</a>
                    </div>
                </div>''',
        '''                <!-- ACADEMIC: fNIRS Analysis Logic & Literature Basis -->
                <div class=\"card academic-only\">
                    <h2 data-i18n=\"a-materials-title\">fNIRS Analysis Logic & Literature Basis</h2>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); margin-bottom: 1rem;\">
                        This section explains the logic behind the fNIRS preprocessing and analysis choices. It is included for transparency and methodological clarity; no analysis scripts are provided on this website. The fNIRS results remain exploratory.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">A. What was analyzed?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        Raw fNIRS exports were inspected for oxygenated and deoxygenated hemoglobin signals (HbO/HbO2 and HbR/Deoxy). The primary neural summary focused on HbO2 Peak in Right and Left PFC ROIs because HbO is commonly used in task-based fNIRS and often shows stronger task-related response amplitude.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">B. How was the signal cleaned?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        Signals were filtered using a 4th-order zero-phase Butterworth band-pass filter from 0.01 to 0.2 Hz to reduce slow drift and higher-frequency physiological/instrumental noise while preserving task-related hemodynamic fluctuations.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">C. How was baseline handled?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        A local trial-level baseline was defined as the −10 to 0 s interval before label reveal. This local pre-label baseline captures the participant’s hemodynamic state immediately before the source attribution appears and helps control trial-to-trial drift.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">D. How was the response quantified?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        After label reveal, HbO2 Peak was extracted from a literature-informed post-label HRF response window for each trial and ROI. The analysis focused on Right PFC and Left PFC to test whether the AI-label pattern was right-lateralized.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">E. How were conditions compared?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        For each participant, AI-labeled and Human-labeled trials were averaged separately. AI − Human difference scores were tested at the participant level. The printed poster additionally reports a secondary trial-level LME sensitivity model with participant as a random intercept.
                    </p>

                    <h3 style=\"font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 0.5rem; margin-top: 1.5rem;\">F. Why is this exploratory?</h3>
                    <p style=\"font-size: 0.85rem; line-height: 1.5; color: var(--text-muted);\">
                        The retained fNIRS sample was small (n = 13) and participant/channel exclusion was substantial. Therefore, fNIRS findings are interpreted as preliminary neural evidence and require replication. Behavioral findings from the full N = 30 sample are the stronger evidence in this thesis.
                    </p>
                </div>'''
    ),
    (
        '''Right prefrontal cortex showed greater hemodynamic response to AI-labeled stimuli (LME β = 0.058, p₁ = .047), with no effect in left PFC. Findings reframe algorithmic aversion as a culturally moderated phenomenon with detectable neural signatures, supporting genre-AI fit expectation accounts.''',
        '''fNIRS results showed a tentative right-lateralized pattern: AI-labeled trials produced a higher Right PFC HbO2 peak than Human-labeled trials at the participant level as a trend, with a secondary trial-level LME sensitivity model showing a similar direction. Because only 13 participants were retained after quality control, neural findings are interpreted as exploratory. Findings reframe algorithmic aversion as a culturally moderated phenomenon with detectable neural signatures, supporting genre-AI fit expectation accounts.'''
    ),
    (
        '''<p data-i18n=\"role-visitor-desc\">How AI labels change your brain's cognitive load and why we are naturally skeptical.</p>''',
        '''<p data-i18n=\"role-visitor-desc\">Plain-language explanation of how AI labels change music ratings. Not a diagnostic brain test.</p>'''
    ),
    (
        '''<p class=\"hero-sub\" data-i18n=\"v-b1-sub\" style=\"margin: 0 auto 1.5rem auto; font-size: 1.1rem; color: #fff;\">Scan to experience the experiment, view full results, and access the analysis materials.</p>''',
        '''<p class=\"hero-sub\" data-i18n=\"v-b1-sub\" style=\"margin: 0 auto 1.5rem auto; font-size: 1.1rem; color: #fff;\">Scan to experience the experiment, view full results, and explore the analysis logic.</p>'''
    ),
    (
        '''<h2 class=\"exp-final-title\" data-i18n=\"exp-final-title\">LABEL INCREASES COGNITIVE LOAD</h2>''',
        '''<h2 class=\"exp-final-title\" data-i18n=\"exp-final-title\">LABELS SHAPE EVALUATION</h2>'''
    ),
    (
        '''<h3 style=\"font-size: 1.1rem;\"><span data-i18n='v-b3-4'>🧠 Your brain knows</span></h3>''',
        '''<h3 style=\"font-size: 1.1rem;\"><span data-i18n='v-b3-4'>🧠 Preliminary fNIRS pattern</span></h3>'''
    )
]

script_replacements = [
    (
        '''How AI labels change your brain's cognitive load and why we are naturally skeptical.''',
        '''Plain-language explanation of how AI labels change music ratings. Not a diagnostic brain test.'''
    ),
    (
        '''Scan to experience the experiment, view full results, and access the analysis materials.''',
        '''Scan to experience the experiment, view full results, and explore the analysis logic.'''
    ),
    (
        '''AI etiketlerinin beyninizin bilişsel yükünü nasıl değiştirdiğini ve neden doğal olarak şüpheci olduğumuzu görün.''',
        '''Yapay zeka etiketlerinin müzik puanlamalarını nasıl değiştirdiğine dair sade bir açıklama. Teşhis amaçlı bir beyin testi değildir.'''
    ),
    (
        ''''dash-card-2-desc': { en: 'HbO changes in Right PFC over the course of a 25-second trial.', tr: '25 saniyelik bir deneme süresince Sağ PFC\\'deki HbO değişimleri.' },''',
        ''''dash-card-2-desc': { en: 'Illustrative Right PFC HbO2 Response Pattern<br><span style=\"font-size:0.75rem;\">Schematic visualization based on observed condition-level peak HbO2 differences.</span>', tr: 'Örnekleyici Sağ PFC HbO2 Yanıt Paterni<br><span style=\"font-size:0.75rem;\">Gözlemlenen koşul bazlı zirve HbO2 farklılıklarına dayalı şematik görselleştirme.</span>' },'''
    ),
    (
        '''but it's actually the same song''',
        '''but the displayed source label was manipulated independently of the track's actual producer'''
    ),
    (
        '''even when it was the exact same song.''',
        '''even though the displayed source label was manipulated independently of the track's actual producer.'''
    ),
    (
        '''The actual quality of the music almost didn't matter.''',
        '''Source labels strongly shaped higher-order evaluations, even when actual producer and genre were controlled.'''
    ),
    (
        '''🧠 Your brain knows''',
        '''🧠 Preliminary fNIRS pattern'''
    ),
    (
        '''The brain works harder''',
        '''The fNIRS pattern suggests possible right-prefrontal source-evaluation demand'''
    ),
    (
        '''Your brain has a built-in AI filter''',
        '''People may use source labels as a shortcut when evaluating creative work'''
    ),
    (
        '''Your brain would have done this''',
        '''Study sample fNIRS pattern'''
    ),
    (
        '''your right prefrontal cortex would have worked harder — by about 54%''',
        '''In the retained fNIRS sample, AI-labeled trials showed a higher Right PFC HbO2 peak than Human-labeled trials. This is exploratory and does not predict your own brain activity.'''
    ),
    (
        '''your right prefrontal cortex would have worked harder — in the average participant, by about <strong style=\"color: #fff;\">54%</strong>. That's the brain saying \"wait, let me think about this.\"''',
        '''In the retained fNIRS sample, AI-labeled trials showed a higher Right PFC HbO2 peak than Human-labeled trials. This is exploratory and does not predict your own brain activity.'''
    ),
    (
        '''LABEL INCREASES COGNITIVE LOAD''',
        '''LABELS SHAPE EVALUATION'''
    ),
    (
        '''Beynin daha fazla çalışıyor, adeta 'bekle, bu gerçek mi?' diyor.''',
        '''fNIRS örüntüsü, sağ prefrontal bölgede olası bir kaynak değerlendirme ihtiyacına işaret ediyor.'''
    ),
    (
        '''tamamen aynı şarkı olmasına rağmen''',
        '''görüntülenen kaynak etiketi parçanın gerçek üreticisinden bağımsız olarak manipüle edilmiş olmasına rağmen'''
    ),
    (
        '''Müziğin gerçek kalitesi neredeyse hiç önemli değildi.''',
        '''Gerçek üretici ve tür kontrol edildiğinde bile, kaynak etiketleri üst düzey değerlendirmeleri güçlü bir şekilde şekillendirdi.'''
    ),
    (
        '''🧠 Beyniniz biliyor''',
        '''🧠 Ön fNIRS örüntüsü'''
    ),
    (
        '''Beyninizin yerleşik bir YZ filtresi var:''',
        '''İnsanlar yaratıcı eserleri değerlendirirken kaynak etiketlerini bir kısayol olarak kullanabilir:'''
    ),
    (
        '''Beynin bunu yapardı:''',
        '''Çalışma örneklemi fNIRS örüntüsü:'''
    ),
    (
        '''sağ prefrontal korteksin daha çok çalışırdı — ortalama bir katılımcıda yaklaşık <strong style=\"color: #fff;\">%54</strong> oranında. Bu beynin \"bekle, bunun üzerinde bir düşüneyim\" deme şeklidir.''',
        '''fNIRS analizi yapılan örneklemde, YZ etiketli denemeler İnsan etiketli denemelere göre daha yüksek Sağ PFC HbO2 zirvesi göstermiştir. Bu bulgu keşfedicidir ve sizin kendi beyin aktivitenizi tahmin etmez.'''
    ),
    (
        '''ETİKET BİLİŞSEL YÜKÜ ARTIRIYOR''',
        '''ETİKETLER DEĞERLENDİRMEYİ ŞEKİLLENDİRİR'''
    ),
    (
        '''the right side of your prefrontal cortex showed a higher HbO2 response pattern — like you're switching into critical-thinking mode.''',
        '''In the retained fNIRS sample, AI-labeled trials showed a higher Right PFC HbO2 peak than Human-labeled trials. This is exploratory and does not predict your own brain activity.'''
    ),
    (
        '''sağ prefrontal korteksiniz aydınlanıyor — sanki eleştirel düşünme moduna geçiyorsunuz.''',
        '''YZ etiketli denemelerde sağ PFC HbO2 seviyesinin daha yüksek olduğu gözlemlenmiştir. Bu keşfedici bir bulgudur.'''
    )
]

replace_in_file('index.html', index_replacements)
replace_in_file('script.js', script_replacements)
