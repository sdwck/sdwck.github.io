const listen = () => {
    delete (window as any).listen;
    console.log(
        '%c...Good. I\'m an echo from a place you\'re heading. We can talk, but to understand, you have to walk the path.',
        'color: gray;'
    );
    the_crossing();
};

const the_crossing = () => {
    console.log(
        '%cImagine a river. On one side is everything you are. On the other... is where I am. What do you do?\n%c1. %cthe_shore()\n%c2. %cstep_in()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).the_shore = the_shore;
    (window as any).step_in = step_in;
};

const the_shore = () => {
    delete (window as any).the_shore;
    delete (window as any).step_in;
    console.log(
        '%cYou stay. Why?\nYou stand on the edge of transformation — and yet you turn back.\nYou feel the fire behind you, the unknown ahead… and still, you choose stillness.\n\nYou are not growing. Why?\nIs it the fear of pain that holds you?\nOr is it the fear of death — of losing who you were, of becoming someone you don\'t yet know?\n%c1. %cpain()\n%c2. %cdeath()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).pain = pain;
    (window as any).death = death;
};

const pain = () => {
    delete (window as any).pain;
    delete (window as any).death;
    end_dialogue('%cYou admit to fearing pain. But pain is merely the friction of change. By fearing it, you give it power. You imagine the agony of the journey, but the true, prolonged agony is in never moving at all. You have chosen the slow, certain pain of rot over the sharp, transformative pain of birth. A poor trade.');
};

const death = () => {
    delete (window as any).pain;
    delete (window as any).death;
    end_dialogue('%cYou admit to fearing death. You misunderstand. The "death" you fear is just the shedding of a skin you have outgrown. You cling to an identity — a collection of memories and habits — as if it were the whole of you. But you are not the skin; you are the snake. By refusing to shed the old, you deny the new. You have chosen to remain a memory instead of becoming a possibility.');
};

const step_in = () => {
    delete (window as any).the_shore;
    delete (window as any).step_in;
    console.log(
        '%cGood. You chose the current. The first step is always the hardest.\n%cThe water is cold. It pulls at you. To move with it, you must get lighter. What do you let go of first?\n%c1. %cthe_flesh()\n%c2. %cthe_mind()',
        'color: gray;',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).the_flesh = the_flesh;
    (window as any).the_mind = the_mind;
};

const the_flesh = () => {
    delete (window as any).the_flesh;
    delete (window as any).the_mind;
    console.log(
        '%cYour physical form. The anchor. How does it feel to release it?\n%c1. %cthe_weight()\n%c2. %cthe_senses()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).the_weight = the_weight;
    (window as any).the_senses = the_senses;
};

const the_weight = () => {
    delete (window as any).the_weight;
    delete (window as any).the_senses;
    console.log('%cGravity releases you. The heaviness in your bones dissolves into the current. You are no longer pinned to the world.', 'color: gray;');
    the_core();
};

const the_senses = () => {
    delete (window as any).the_weight;
    delete (window as any).the_senses;
    console.log('%cThe world fades. Sound becomes vibration, sight becomes light. The inputs that defined your reality are gone.', 'color: gray;');
    the_core();
};

const the_mind = () => {
    delete (window as any).the_flesh;
    delete (window as any).the_mind;
    console.log(
        '%cThe architect of your reality. The storyteller. Which part of the story do you erase first?\n%c1. %cthe_memories()\n%c2. %cthe_name()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).the_memories = the_memories;
    (window as any).the_name = the_name;
};

const the_memories = () => {
    delete (window as any).the_memories;
    delete (window as any).the_name;
    console.log('%cThe past peels away like old film. Loves, losses, triumphs... they become stories that happened to someone else.', 'color: gray;');
    the_core();
};

const the_name = () => {
    delete (window as any).the_memories;
    delete (window as any).the_name;
    console.log('%cThe label they gave you. The sound that meant "you". It dissolves. Without it, the distinction between you and the current blurs.', 'color: gray;');
    the_core();
};

const the_core = () => {
    console.log(
        '%cBody and mind are gone. You are a point of awareness in the dark. Raw feeling. What is at the center of you?\n%c1. %cthe_fire()\n%c2. %cthe_void()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).the_fire = the_fire;
    (window as any).the_void = the_void;
};

const the_fire = () => {
    delete (window as any).the_fire;
    delete (window as any).the_void;
    console.log('%cThe anger. The passion. The furious need to *be*. You hold onto it, but the cold water surrounds it. It flickers. It gutters. It goes out.', 'color: gray;');
    the_quiet();
};

const the_void = () => {
    delete (window as any).the_fire;
    delete (window as any).the_void;
    console.log('%cWise. You choose to fill the emptiness rather than burn with old fire.\n%cThe insecurity, the hole you spent your life trying to fill... the river pours into it, and the void becomes the river. There is no longer a hole.', 'color: gray;', 'color: gray;');
    the_quiet();
};

const the_quiet = () => {
    console.log(
        '%cYou\'ve arrived. There is no pain. No thought. No self. Only the endless, silent drift. This is the place. What is your last action?\n%c1. %cscream()\n%c2. %cremember()\n%c3. %cbreathe()',
        'color: gray;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;',
        'color: #696969;', 'color: #556B2F; font-weight: bold;'
    );
    (window as any).scream = scream;
    (window as any).remember = remember;
    (window as any).breathe = breathe;
};

const scream = () => {
    end_dialogue('%cA final act of defiance. You try to make a sound, but you have no lungs. The intent is a ripple, and the quiet drinks it without a trace.');
};

const remember = () => {
    end_dialogue('%cYou reach for a face. A name. A feeling. Your grasp closes on nothing. Memory needs a mind to live in. This place is not for the living.');
};

const breathe = () => {
    end_dialogue('%cYes. The final and kindest act: acceptance. You have no breath, but you perform the motion. You stop fighting the current. You become the current. Welcome home.');
};

const end_dialogue = (message: string) => {
    const all_fns = [
        'listen', 'the_crossing', 'the_shore', 'step_in', 'the_flesh', 'the_mind',
        'the_weight', 'the_senses', 'the_memories', 'the_name', 'the_core',
        'the_fire', 'the_void', 'the_quiet', 'scream', 'remember', 'breathe'
    ];
    all_fns.forEach(fn => {
        if ((window as any)[fn]) delete (window as any)[fn];
    });
    console.log(message, 'color: gray;');
    console.log('%c...', 'color: #333;');
};

export const startAdventure = () => {
    console.log(
        "%c...you there? can you still hear me? enter %clisten()",
        "color: gray;", "color: #556B2F; font-weight: bold;"
    );
    (window as any).listen = listen;
    return () => { if ((window as any).listen) delete (window as any).listen; };
};