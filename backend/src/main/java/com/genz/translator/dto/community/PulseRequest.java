package com.genz.translator.dto.community;

import com.genz.translator.model.community.PulseType;
import jakarta.validation.constraints.NotNull;

public class PulseRequest {

    @NotNull
    private PulseType pulseType;

    public PulseType getPulseType() {
        return pulseType;
    }

    public void setPulseType(PulseType pulseType) {
        this.pulseType = pulseType;
    }
}
