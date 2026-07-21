import { COLORS } from "../constans";

export function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}
