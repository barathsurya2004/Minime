/**
 * Room Animation Controller
 * Manages all animations for the Room model
 * 
 * This file is separate from Room.jsx to prevent loss of animation logic
 * when regenerating the Room component with new animation data.
 * 
 * Animation Names Available:
 * - "angry"
 * - "gaming"
 * - "happy_idle"
 * - "happy_petting"
 * - "running"
 * - "sleeping"
 * - "talking"
 * - "working"
 * - "working_out"
 */

import gsap from "gsap";
import type { Object3D } from "three";
import { Activity, type ActivityState, type Mood } from "@/lib/ai/activity";
const previousActionRef = { current: null as string | null };
const activeActionRef = { current: null as string | null };
declare global {
    interface Window {
        playRoomAnimation?: (name: string) => void;
        stopRoomAnimation?: (name: string) => void;
        playRoomAnimationWithBlend?: (
            fromName: string,
            toName: string,
            options?: BlendOptions
        ) => void;
        playRoomAnimationWithCrossfade?: (
            fromName: string,
            toName: string,
            options?: BlendOptions
        ) => void;
        playRoomAnimationWithGsapAndBlend?: (
            fromName: string,
            middleAnim: string,
            toName: string,
            gsapConfigFn: () => gsap.TweenVars,
            options?: BlendOptions
        ) => void;
    }
}

type BlendOptions = {
    fadeDuration?: number;
};

// Internal refs set by Room component
let armatureRef: Object3D | null = null;

export const setArmatureRef = (ref: Object3D | null) => {
    armatureRef = ref ?? null;
};

export const getArmatureRef = () => armatureRef;

// Internal refs for face management
let faceRefs: Record<string, React.RefObject<any>> | null = null;

export const SetFaceRefs = (refs: Record<string, React.RefObject<any>>) => {
    faceRefs = refs;
};

export const getFaceRefs = () => faceRefs;

const RunTimings = {
    gaming: 5,
    gymming: 2,
}


const getArmatureOrWarn = () => {
    const ref = getArmatureRef();
    if (!ref) {
        console.warn("Armature ref not set yet");
        return null;
    }
    return ref;
};

// Helper function to safely play animations
const playAnimationByName = (name: string) => {
    if (typeof window !== 'undefined' && window.playRoomAnimation) {
        window.playRoomAnimation(name);
    } else {
        console.warn(`Could not play animation: ${name} (window function not available)`);
    }
};

// Helper function to safely stop animations
const stopAnimationByName = (name: string) => {
    if (typeof window !== 'undefined' && window.stopRoomAnimation) {
        window.stopRoomAnimation(name);
    } else {
        console.warn(`Could not stop animation: ${name} (window function not available)`);
    }
};

// Helper to blend from one animation to another
const playAnimationWithBlend = (
    fromName: string,
    toName: string,
    options?: BlendOptions
) => {
    if (typeof window !== 'undefined' && window.playRoomAnimationWithBlend) {
        window.playRoomAnimationWithBlend(fromName, toName, options);
    } else {
        console.warn(`Could not blend animations: ${fromName} -> ${toName} (window function not available)`);
    }
};

// Helper to crossfade from one animation to another
const playAnimationWithCrossfade = (
    fromName: string,
    toName: string,
    options?: BlendOptions
) => {
    if (typeof window !== 'undefined' && window.playRoomAnimationWithCrossfade) {
        window.playRoomAnimationWithCrossfade(fromName, toName, options);
    } else {
        console.warn(`Could not crossfade animations: ${fromName} -> ${toName} (window function not available)`);
    }
};

// Helper to orchestrate complex: from -> middle (loop+gsap) -> to
const playAnimationWithGsapAndBlend = (
    fromName: string,
    middleAnim: string,
    toName: string,
    gsapConfigFn: () => gsap.TweenVars,
    options?: BlendOptions
) => {
    if (typeof window !== 'undefined' && window.playRoomAnimationWithGsapAndBlend) {
        window.playRoomAnimationWithGsapAndBlend(fromName, middleAnim, toName, gsapConfigFn, options);
    } else {
        console.warn(`Could not chain complex animations: ${fromName} -> ${middleAnim} -> ${toName} (window function not available)`);
    }
};



// Animation control functions - now linked to actual animations
export const playGaming = () => {
    playAnimationByName('gaming')
    const armature = getArmatureOrWarn()
    activeActionRef.current = 'gaming'
    if (!armature) return

    gsap.set(armature.position, {
        x: -4.05,
        y: 1.34,
        z: -3.482
    })
    gsap.set(armature.rotation, {
        z: 0.02
    })
}

export const stopGaming = () => {
}

export const playGymming = () => {

    const armature = getArmatureOrWarn()
    if (!armature) return
    gsap.set(armature.position, {
        x: 0.34,
        z: 0.87,
        y: 1.05,

    })
    gsap.set(armature.rotation, {
        z: -2.15
    })



    playAnimationByName('working_out')
    activeActionRef.current = 'working_out'
}

export const stopGymming = () => {
    stopAnimationByName('working_out')
}

export const playSleeping = () => {

    const armature = getArmatureOrWarn()
    if (!armature) return
    gsap.set(armature.position, {
        x: -4.40,
        z: -4.24,
        y: 1.8,

    })
    gsap.set(armature.rotation, {
        z: 0.27
    })
    playAnimationByName('sleeping')
    activeActionRef.current = 'sleeping'
}

export const stopSleeping = () => {
    stopAnimationByName('sleeping')
}

export const playTalking = () => {
    playAnimationWithCrossfade(activeActionRef.current || 'idle', 'talking', { fadeDuration: 0.5 })
    activeActionRef.current = 'talking'
}

export const stopTalking = () => {
    stopAnimationByName('talking')
}

export const playIdle = () => {
    playAnimationWithCrossfade(activeActionRef.current || 'sleeping', 'happy_idle', { fadeDuration: 0.5 })
    activeActionRef.current = 'happy_idle'
}

export const stopIdle = () => {
    stopAnimationByName('happy_idle')
}

export const playHappy = () => {
    playAnimationWithCrossfade(activeActionRef.current || 'idle', 'happy_petting', { fadeDuration: 0.5 })
    activeActionRef.current = 'happy_petting'
}

export const stopHappy = () => {
    stopAnimationByName('happy_petting')
}



export const playRunning = () => {
    playAnimationWithCrossfade(activeActionRef.current || 'idle', 'running', { fadeDuration: 0.3 })
    activeActionRef.current = 'running'
    const armature = getArmatureOrWarn()
    if (!armature) return
    let duration;
    if (activeActionRef.current === 'gaming') {
        duration = RunTimings.gaming
    } else if (activeActionRef.current === 'working_out') {
        duration = RunTimings.gymming
    } else {
        duration = 3
    }

    gsap.to(armature.position, {
        x: 1.74,
        y: 1.05,
        z: 1.78,
        duration: duration,
        ease: "power2.out",
    })
    gsap.to(armature.rotation, {
        z: 0.73,
        duration: duration / 2,
        ease: "power2.out"
    })
}


export const stopRunning = () => {
}

export const playWorking = () => {
    playAnimationByName('working')
    const armature = getArmatureOrWarn()
    if (!armature) return

    gsap.set(armature.position, {
        x: -4.05,
        y: 1.34,
        z: -3.482
    })
    gsap.set(armature.rotation, {
        z: 0.02
    })
    activeActionRef.current = 'working'
}

export const stopWorking = () => {
    stopAnimationByName('working')
}

/**
 * Animation Event Handler
 * Manages which animation to play based on:
 * - activityState: current activity (idle, sleeping, gaming, studying, etc.)
 * - mood: emotional state (happy, sad, neutral, etc.)
 * - currentHour: time of day
 */
export const handleAnimationState = (
    activityState: ActivityState,
    mood: Mood,
    currentHour: number
) => {

    // Stop all animations first
    stopGaming()
    stopGymming()
    stopSleeping()
    stopTalking()
    stopIdle()
    stopHappy()
    stopRunning()
    stopWorking()

    // Map activity states to animations
    switch (activityState.toLowerCase()) {
        case 'gaming':
            playGaming()
            break

        case 'gymming':
        case 'exercising':
            playGymming()
            break

        case 'sleeping':
            playSleeping()
            break

        case 'talking':
            playTalking()
            break
        case 'listening':
            playIdle();
            break;

        case 'working':
        case 'studying':
            playWorking()
            break

        case 'running':
            playRunning()
            break

        case 'idle':
        default:
            // Check mood for idle state
            if (mood === 'happy' || mood === 'cheerful') {
                playHappy()
            } else {
                playIdle()
            }
            break
    }

    setMood(mood)

}
const setMood = (mood: Mood): void => {
    console.log(`Setting mood to: ${mood}`)
    const refs = getFaceRefs()
    if (!refs) {
        console.warn("Face refs not set yet");
        return;
    }

    // Hide all faces first
    Object.values(refs).forEach(ref => {
        if (ref.current) ref.current.visible = false;
    });
    switch (mood) {
        case 'happy':
            if (refs.happy.current) refs.happy.current.visible = true;
            break;
        case 'sad':
            if (refs.sad.current) refs.sad.current.visible = true;
            break;
        case 'neutral':
            if (refs.neutral.current) refs.neutral.current.visible = true;
            break;
        case 'cheerful':
            if (refs.cheerful.current) refs.cheerful.current.visible = true;
            break;
        default:
            if (refs.neutral.current) refs.neutral.current.visible = true;
            break;
    }
}

/**
 * Hook for React components to use animation state
 * Import and call this in your Room component's useEffect
 */
export const useRoomAnimations = (
    activityState: ActivityState,
    mood: Mood,
    currentHour: number
) => {
    handleAnimationState(activityState, mood, currentHour)
}

const getHourInTimeZone = (timeZone: string): number => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: 'numeric',
        hour12: false,
    })

    const parsed = Number(formatter.format(new Date()))
    if (Number.isNaN(parsed)) {
        return new Date().getHours()
    }

    return parsed
}

export const get_initial_activity = (): ActivityState => {
    const timeZone = 'Asia/Kolkata'
    const currentHour = getHourInTimeZone(timeZone)

    let activityState: ActivityState = Activity.SLEEPING
    let mood: Mood = 'neutral'

    if (currentHour >= 5 && currentHour < 8) {
        activityState = Activity.GYMMING
    } else if (currentHour >= 8 && currentHour < 12) {
        activityState = Activity.WORKING
        mood = 'sad'
    } else if (currentHour >= 12 && currentHour < 17) {
        activityState = Activity.GAMING
        mood = 'cheerful'
    } else if (currentHour >= 17 && currentHour < 21) {
        activityState = Activity.WORKING
        mood = 'sad'
    }

    return activityState
}

export const init_animations = () => {
    const initialActivity = get_initial_activity()
    const currentHour = getHourInTimeZone('Asia/Kolkata')
    handleAnimationState(initialActivity, 'neutral', currentHour)
    return initialActivity
}