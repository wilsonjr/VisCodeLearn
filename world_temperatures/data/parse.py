shem = []
nhem = []
glob = []
year = []

fopen = open('world_temperatures.tsv', 'rU')
line = fopen.readline()
line = fopen.readline()

while len(line) != 0:
	elems = line.split()[:4]
	year.append(elems[0])
	glob.append(elems[1])
	nhem.append(elems[2])
	shem.append(elems[3])
	line = fopen.readline()	

fopen.close()

fwrite = open('world_temperatures2.tsv', 'w')
fwrite.write('Year\tDescription\tTemperature\n')
for i in range(0, len(glob)):
	fwrite.write(str(year[i])+'\tGlob\t'+str(glob[i])+'\n')
for i in range(0, len(glob)):
	fwrite.write(str(year[i])+'\tNHem\t'+str(nhem[i])+'\n')
for i in range(0, len(glob)):
	fwrite.write(str(year[i])+'\tSHem\t'+str(shem[i])+'\n')	
fwrite.close()
