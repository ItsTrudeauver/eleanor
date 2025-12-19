document.addEventListener('DOMContentLoaded', () => {
    //const ambience = document.getElementById('ambience');
    //ambience.volume = 0.3;
    //ambience.play();

    const scenes = [
        { // Scene 1: Eleanor's Mom’s Request
            lines: [
                {text: '"Mom. I brought you something—your tea."', delay: 1000, effects: ['tremble']},
                {text: '"The chamomile you like."', delay: 4000, effects: ['breath']},
                {text: '"Ellie… you didn’t have to do that."', delay: 7000, effects: ['tear']},
                {text: '"You shouldn’t be here, baby."', delay: 11000, effects: ['tremble']},
                {text: '"I want you to file the request."', delay: 15000, effects: ['final-line']}
            ],
            duration: 20000
        },
        { // Scene 2: Informed Consent
            lines: [
                {text: '"Before we proceed, we need to go over the informed consent form."', delay: 21000},
                {text: '"The form states that the patient understands..."', delay: 25000},
                {text: '"I do."', delay: 29000, effects: ['breath', 'tremble']},
                {text: '"This is the last thing I can do for you."', delay: 33000, effects: ['tear']}
            ],
            duration: 15000
        },
        { // Scene 3: After the Procedure
            lines: [
                {text: '[The beeping slows.]', delay: 47000, effects: ['breath']},
                {text: '[Slows.]', delay: 50000},
                {text: '[Then—nothing.]', delay: 53000},
                {text: '"I— I—"', delay: 56000, effects: ['tremble', 'tear']},
                {text: '[A single, raw sob.]', delay: 60000, effects: ['final-line']}
            ],
            duration: 25000
        }
    ];

    scenes.forEach((scene, index) => {
        const sceneElement = document.getElementById(`scene${index + 1}`);
        sceneElement.style.animation = `fadeScene ${scene.duration}ms linear ${scene.lines[0].delay}ms`;

        scene.lines.forEach(line => {
            setTimeout(() => {
                const lineElement = document.createElement('div');
                lineElement.className = 'text-block';
                lineElement.textContent = line.text;

                if (line.effects) {
                    line.effects.forEach(effect => {
                        if (effect === 'tear') {
                            const tear = document.createElement('div');
                            tear.className = 'tear-smear';
                            lineElement.appendChild(tear);
                        } else {
                            lineElement.classList.add(effect);
                        }
                    });
                }

                sceneElement.appendChild(lineElement);
            }, line.delay);
        });
    });

    // Stop audio when all scenes are done
  
});