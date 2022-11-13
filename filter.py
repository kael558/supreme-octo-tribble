import csv

filename = 'Image Synthesis Style Studies Database (The List) - Artists.csv'
filter = 'children'
output_file = filter + '.csv'

with open(output_file, 'w', newline='') as outfile:
    datawriter = csv.writer(outfile, delimiter=',')
    with open(filename, 'r', encoding='cp850') as infile:
        datareader = csv.reader(infile)
        for row in datareader:
            if filter in row[6]:
                datawriter.writerow(row)
