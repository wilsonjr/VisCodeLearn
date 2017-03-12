

def filter_file(filename, output, columns):

	if len(columns) != 0:
		f = open(filename, 'rU')
		foutput = open(output, 'w')
		
		columns_desc = f.readline().split(';')
		desc_index = []
		for column in columns:
			desc_index.append(columns_desc.index(column))

		foutput.write(';'.join(columns)+'\n')
		for line in f:
			line_columns = line.split(';')
			
			selected_columns = []
			for index in desc_index:
				selected_columns.append(line_columns[index])

			foutput.write(';'.join(selected_columns)+'\n')
			
def main():

	columns = ['ANO_CONCESSAO_BOLSA', 'SEXO_BENEFICIARIO_BOLSA', 'REGIAO_BENEFICIARIO_BOLSA', 'SIGLA_UF_BENEFICIARIO_BOLSA']

	filter_file('prouni.csv', 'prouni_filter.csv', columns)


if __name__ == '__main__':
	main()






