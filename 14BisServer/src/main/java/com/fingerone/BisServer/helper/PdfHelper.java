package com.fingerone.BisServer.helper;

import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.text.PDFTextStripperByArea;
import org.springframework.stereotype.Component;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@NoArgsConstructor
@Slf4j
public class PdfHelper {
    private final Pattern revisionPattern = Pattern.compile("(revision \\d{1,5}|original)", Pattern.CASE_INSENSITIVE);
    private final Pattern codePattern = Pattern.compile("code \\d{1,5}", Pattern.CASE_INSENSITIVE);
    private final Pattern pagePattern = Pattern.compile("page \\d{1,5}", Pattern.CASE_INSENSITIVE);

    public void extractPageInNewPdfFile(PDPage page, String path) throws IOException {
        // Creating folders structure
        int indexLastSeparator = path.lastIndexOf(File.separator);
        File folderPath = new File(path.substring(0, indexLastSeparator));
        folderPath.mkdirs();
        // Saving a new PDF
        PDDocument newPdfDocument = new PDDocument();
        newPdfDocument.addPage(page);
        try {
            newPdfDocument.save(path);
            newPdfDocument.close();
        } catch (IOException ex) {
            log.error("Fail saving a new PDF file with single page", ex);
        } finally {
            newPdfDocument.close();
        }
    }

    public String extractFooterData(PDPage page) throws IOException {
        val stripper = new PDFTextStripperByArea();
        stripper.setSortByPosition(true);
        Rectangle2D rect = new Rectangle2D.Float(0f, 570f, 400f, 60f);
        stripper.addRegion("footer_data", rect);
        stripper.extractRegions(page);
        // Data treatment
        return stripper.getTextForRegion("footer_data");
    }

    public List<PDPage> getAllPdfPages(String pdfPath, int startPage) throws IOException {
        PDDocument document = null;
        List<PDPage> pages = new ArrayList<>();
        try {
            document = PDDocument.load(new File(pdfPath));
            int pageIndex = startPage;
            while (pageIndex < document.getNumberOfPages()) {
                pages.add(document.getPage(pageIndex++));
            }
        } catch (IOException e) {
            log.error("Fail loading PDF file", e);
            pages = Collections.emptyList();
        } finally {
            if(document != null)
                document.close();
        }
        return pages;
    }


    public String getRevisionValue(String content, String defaultValue) {
        return extractValueByPattern(revisionPattern, content, defaultValue);
    }

    public String getCodeValue(String content, String defaultValue) {
        return extractValueByPattern(codePattern, content, defaultValue);
    }

    public String getPageValue(String content, String defaultValue) {
        return extractValueByPattern(pagePattern, content, defaultValue);
    }

    private String extractValueByPattern(Pattern pattern, String content, String defaultValue) {
        Matcher matcher = pattern.matcher(content);
        return matcher.find() ? matcher.group() : defaultValue;
    }

}
