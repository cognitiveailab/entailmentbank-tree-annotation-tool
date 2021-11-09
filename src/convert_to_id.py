# This tool is intended to (1) combine two existing JSON output files for the tool (e.g. from train and dev sets), (2) give them IDs so json-server works. 
# It also sorts the resulting combination by question class, so the train/dev sets are mixed/sorted by QC for annotation as expected.

# convert_to_id.py

import json

filenameInTrain = "/home/peter/github/explsent-ranking-tree/src/" + "testdata-train.json"
#filenameInDev = "/home/peter/github/explsent-ranking-tree/src/" + "testdata1.json"
filenameInDev = "/home/peter/github/explsent-ranking/src/" + "testdata1.json"

filenameOut = "/home/peter/github/explsent-ranking-tree/src/" + "testdata-train-dev-out1.json"


# Step 1: Load existing file
with open(filenameInTrain) as f:
  existingFileTrain = json.load(f)

# Flatten
existingFileTrain['sampleData'] = existingFileTrain['sampleData']['questionData']

# Give IDs, just in case / to make life easier
length = len(existingFileTrain['sampleData'])
for i in range( len(existingFileTrain['sampleData']) ):
    existingFileTrain['sampleData'][i]['trainId'] = i
    existingFileTrain['sampleData'][i]['fold'] = "train"



# Step 1: Load existing file
with open(filenameInDev) as f:
  existingFileDev = json.load(f)

# Flatten
existingFileDev['sampleData'] = existingFileDev['sampleData']['questionData']

# Given IDs, just in case / to make life easier
length = len(existingFileDev['sampleData'])
for i in range( len(existingFileDev['sampleData']) ):
    existingFileDev['sampleData'][i]['devId'] = i
    existingFileDev['sampleData'][i]['fold'] = "dev"



# Combine
outputFile = {}
# Add discourse
outputFile['discourseMarkers'] = existingFileTrain['discourseMarkers']

# Do combination/sorting
combinedData = existingFileTrain['sampleData'] + existingFileDev['sampleData']
print(combinedData[0])
sortedData = sorted(combinedData, key=lambda x: x['topics'][0], reverse=False)

print("sortedData: " + str(len(sortedData)))

outputFile['sampleData'] = sortedData

# Sort (by question class)


# Add universal IDs
for i in range(len(outputFile['sampleData'])):
    outputFile['sampleData'][i]['id'] = (i+1)
    print(i)


# Export
print(" Writing " + filenameOut)
with open(filenameOut, 'w') as jsonFile:
    jsonFile.write( json.dumps(outputFile, indent=4, sort_keys=False) )

