

def filter_file(filename, output, columns):

	if len(columns) != 0:
		f = open(filename, 'rU')
		columns_desc = f.readline().split(';')
		desc_index = []
		for column in columns:
			desc_index.append(columns_desc.index(column))


		for line in f:
			print(line)

		print(columns_desc)
		print(desc_index)







def main():

	columns = ['ANO_CONCESSAO_BOLSA', 'SEXO_BENEFICIARIO_BOLSA', 'REGIAO_BENEFICIARIO_BOLSA', 'SIGLA_UF_BENEFICIARIO_BOLSA']

	filter_file('prouni.csv', 'prouni_filter.csv', columns)


if __name__ == '__main__':
	main()






