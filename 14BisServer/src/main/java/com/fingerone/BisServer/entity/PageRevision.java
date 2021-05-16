package com.fingerone.BisServer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.File;

@Entity
@Table(name = "revision_pdf_pages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageRevision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JsonIgnore
    @JoinColumn(name="pdf_page_id", nullable = false)
    private PdfPage pdfPage;
    @Column(name = "file_name", nullable = false)
    private String fileName;
    private String revision;

    @JsonIgnore
    public String getPathStorageFile() {
        if(getPdfPage() == null)
            return null;
        // Geracao do caminho relativo onde a pagina da revisao sera armazenada
        StringBuilder sb = new StringBuilder();
        return sb.append(File.separator).append(getPdfPage().getBlock().toLowerCase().replaceAll(" ", ""))
                .append(File.separator).append(getPdfPage().getCode().toLowerCase().replaceAll(" ", ""))
                .append(File.separator).append("page").append(getPdfPage().getPage())
                .append(File.separator).append(getRevision().toLowerCase().replaceAll(" ", ""))
                .append(".pdf")
                .toString();
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;

        if(this == null || getClass() != o.getClass())
            return false;

        PageRevision pageRevision = (PageRevision) o;
        return pageRevision.getRevision().equalsIgnoreCase(this.getRevision())
                && (pageRevision.getPdfPage().getId() == null
                    || pageRevision.getPdfPage().getId().equals(this.getPdfPage().getId()));
    }
}
