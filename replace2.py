import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

script_replacements = [
    (
        '''When you saw the \\'AI\\' label, In the retained fNIRS sample, AI-labeled trials showed a higher Right PFC HbO2 peak than Human-labeled trials. This is exploratory and does not predict your own brain activity.''',
        '''In the retained fNIRS sample, AI-labeled trials showed a higher Right PFC HbO2 peak than Human-labeled trials. This is exploratory and does not predict your own brain activity.'''
    ),
    (
        '''"AI" labeled music activated the brain\\'s right-prefrontal source-evaluation processes <span class="exp-highlight">a higher Right PFC HbO2 peak in the study sample</span>, even when the sound was identical.''',
        '''"AI" labeled music activated a higher Right PFC HbO2 peak in the study sample, even though the displayed source label was manipulated independently of the track\\'s actual producer.'''
    ),
    (
        '''even when the sound was identical''',
        '''even though the displayed source label was manipulated independently of the track\\'s actual producer'''
    ),
    (
        '''<span class="exp-highlight">%54 daha fazla</span> aktive etti.''',
        '''daha yüksek bir HbO2 zirvesi ile aktive etti (keşfedici bulgu).'''
    ),
    (
        '''"AI" etiketli müzik, ses tamamen aynı olsa bile beynin şüphecilik ve değerlendirme merkezini daha yüksek bir HbO2 zirvesi ile aktive etti (keşfedici bulgu).''',
        '''"AI" etiketli müzik, görüntülenen kaynak etiketi parçanın gerçek üreticisinden bağımsız olarak manipüle edilmiş olmasına rağmen, sağ prefrontal kortekste daha yüksek bir HbO2 zirvesi gösterdi (keşfedici bulgu).'''
    )
]

index_replacements = [
    (
        '''even when the sound was identical''',
        '''even though the displayed source label was manipulated independently of the track\\'s actual producer'''
    )
]

replace_in_file('script.js', script_replacements)
replace_in_file('index.html', index_replacements)
