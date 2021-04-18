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

	public static List<CodeList> excelToCodeLists(InputStream is) {
		try {
			Workbook workbook = new XSSFWorkbook(is);

			Sheet sheet = workbook.getSheet(SHEET);
			Iterator<Row> rows = sheet.iterator();

			List<CodeList> codelists = new ArrayList<CodeList>();

			int rowNumber = 0;
			while (rows.hasNext()) {
				Row currentRow = rows.next();

				// skip header
				if (rowNumber == 0) {
					rowNumber++;
					continue;
				}

				Iterator<Cell> cellsInRow = currentRow.iterator();

				CodeList codelist = new CodeList();

				DataFormatter formatter = new DataFormatter();
				int cellIdx = 0;
				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();

					switch (cellIdx) {
					case 0:
						codelist.setSecao(currentCell.getStringCellValue());
						break;

					case 1:
						codelist.setSubSecao(currentCell.getStringCellValue());
						break;

					case 2:
						codelist.setBloco(currentCell.getStringCellValue());
						break;

					case 3:
						codelist.setNomeBloco(currentCell.getStringCellValue());
						break;

					case 4:
						codelist.setCodigo(currentCell.getStringCellValue());
						break;

					case 5:
						codelist.setAplicabilidade(formatter.formatCellValue(currentCell));
						break;

					case 6:
						codelist.setTag(currentCell.getStringCellValue());
						break;

					default:
						break;
					}

					cellIdx++;
				}

				codelists.add(codelist);
			}

			return codelists;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
		}
	}
}
