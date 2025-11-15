package com.genz.translator.dto.community;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RemixRequest {

    @NotBlank
    @Size(max = 400)
    private String remixText;

    public String getRemixText() {
        return remixText;
    }

    public void setRemixText(String remixText) {
        this.remixText = remixText;
    }
}
