package com.fingerone.BisServer.model;

import com.fingerone.BisServer.enums.ProcessStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ProcessPdfResponse {
    private Long numberOfPages;
    private ProcessStatus status;
    private String files;

    public ProcessPdfResponse() {
        files = "";
        numberOfPages = -1L;
        status = ProcessStatus.UNSUCCESS;
    }
}
