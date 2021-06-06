package com.fingerone.BisServer.helper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.fingerone.BisServer.entity.Manual;
import com.fingerone.BisServer.model.CodeList;

public class ExcelHelper {

	public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	static String[] HEADERs = { "Id", "secao", "subSecao", "bloco", "nomeBloco", "codigo", "aplicabilidade", "tag" };
	static String SHEET = "codelist";

	public static boolean hasExcelFormat(MultipartFile file) {

		if (!TYPE.equals(file.getContentType())) {
			return false;
		}

		return true;
	}

	public static List<CodeList> excelToCodeLists(InputStream is, Manual manual) {
		try {
			Workbook workbook = new XSSFWorkbook(is);

			Sheet sheet = workbook.getSheet(SHEET);
			Iterator<Row> rows = sheet.iterator();

			List<CodeList> codelists = new ArrayList<CodeList>();

			List<String> tagsCatalog = new ArrayList<String>();

			int rowNumber = 0;
			while (rows.hasNext()) {
				Row currentRow = rows.next();

				// Processamento do header
				if (rowNumber == 0) {
					// coluna 6 por diante = tags
					Iterator<Cell> cellsInRow = currentRow.iterator();
					int cellIdx = 0;
					while (cellsInRow.hasNext()) {
						Cell currentCell = cellsInRow.next();
						String tag = "";
						if (cellIdx > 5) {
							tag = currentCell.getStringCellValue();
							
							// se tiver code com traço e espaço no texto da tag, ele remove e pega apenas o texto
							if (tag.contains("-")) {
								tag = tag.split("-")[1].trim();
							}
							tagsCatalog.add(tag);
						}
						
						cellIdx++;
					}

					rowNumber++;
					continue;
				}

				Iterator<Cell> cellsInRow = currentRow.iterator();

				CodeList codelist = new CodeList();
				codelist.setManual(manual);

				DataFormatter formatter = new DataFormatter();
				int cellIdx = 0;
				List<String> tagsToAdd = new ArrayList<String>();
				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();
					
					if (cellIdx == 0) {
						codelist.setSecao(currentCell.getStringCellValue());
					} else if (cellIdx == 1) {
						codelist.setSubSecao(currentCell.getStringCellValue());
					} else if (cellIdx == 2) {
						codelist.setBloco(currentCell.getStringCellValue());
					} else if (cellIdx == 3) {
						codelist.setNomeBloco(currentCell.getStringCellValue());
					} else if (cellIdx == 4) {
						codelist.setCodigo(currentCell.getStringCellValue());
					} else if (cellIdx == 5) {
						codelist.setAplicabilidade(formatter.formatCellValue(currentCell));
					} else if (cellIdx >= 6) {
						int tagCount = cellIdx - 6;
						
						if (currentCell.getNumericCellValue() == 1) {
							tagsToAdd.add(tagsCatalog.get(tagCount));
						}
					}
					cellIdx++;
				}
				codelist.setTag(String.join(",", tagsToAdd));
				codelists.add(codelist);
			}

			return codelists;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
		}
	}
}
