package com.genz.translator.model.community;

public enum PulseType {
    MIND_BEND("🌀 mindbend"),
    CHILL("🧊 chill"),
    HYPE("⚡ hype"),
    SAGE("🌿 sage"),
    COSMIC("✨ cosmic");

    private final String label;

    PulseType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
