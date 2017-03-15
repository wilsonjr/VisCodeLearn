

def filter_file(filename, output, columns):

	if len(columns) != 0:
		f = open(filename, 'rU')
		foutput = open(output, 'w')
		
		columns_desc = f.readline().split(';')
		for i in range(len(columns_desc)):
			columns_desc[i] = columns_desc[i].strip()
		desc_index = []
		for column in columns:
			desc_index.append(columns_desc.index(column))

		foutput.write(';'.join(columns)+'\n')
		for line in f:
			line_columns = line.split(';')
			
			lost_data = False
			selected_columns = []
			for index in desc_index:
				if len(line_columns[index]) == 0:
					lost_data = True					
				selected_columns.append(line_columns[index].strip())

			if not lost_data:
				foutput.write(';'.join(selected_columns)+'\n')
			
def main():

	columns = ['ANO_CONCESSAO_BOLSA', 'SEXO_BENEFICIARIO_BOLSA', 'REGIAO_BENEFICIARIO_BOLSA', 'SIGLA_UF_BENEFICIARIO_BOLSA']

	filter_file('prouni_filter.csv', 'prouni_filter2.csv', columns)


if __name__ == '__main__':
	main()






