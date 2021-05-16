package com.fingerone.BisServer.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "pdf_pages_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String block;
    @Column(nullable = false)
    private String code;
    @Column(nullable = false)
    private Long page;
    @OneToMany(mappedBy= "pdfPage", cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PageRevision> revisions;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(block).append(" - ")
            .append(code).append(" - ")
            .append(page);
        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;

        if(this == null || getClass() != o.getClass())
            return false;

        PdfPage pdfPage = (PdfPage) o;
        return pdfPage.getBlock().equalsIgnoreCase(this.getBlock())
                && pdfPage.getCode().equalsIgnoreCase(this.getCode())
                && pdfPage.getPage().equals(this.getPage());
    }
}
