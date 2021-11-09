# Convert TFR-BERT format to internal format

import json

filename = "/home/peter/github/peter-ranking/ranking/worldtree/" + "worldtreescoresOut.max8.base50k.latestmodel.train.json.rewrite.json"

filenameDiscourse = "/home/peter/github/explsent-ranking-tree/src/" + "testdata1.json"
filenameOut = "/home/peter/github/explsent-ranking-tree/src/" + "testdata2.json"


# Step 1: Load existing discourse markers
with open(filenameDiscourse) as f:
  discourse = json.load(f)

discourseMarkers = discourse['discourseMarkers']


# Step 2: Convert questions
with open(filename) as f:
  data = json.load(f)


rankingProblems = data['rankingProblemsOutput']

print(rankingProblems)

print( len(rankingProblems) )

removeMarker = {}
removeMarker['id'] = "removemarker"
removeMarker['isRemoved'] = False
removeMarker['isHoveredOver'] = False
removeMarker['content'] = "Remove Marker"
removeMarker['bgcolor'] = "#FFCCCC"

questionData = []

for elem in rankingProblems:

    oneQuestion = {}
    oneQuestion['qid'] = elem['qid']
    oneQuestion['topics'] = elem['topics']
    oneQuestion['questionText'] = elem['questionText']
    oneQuestion['answerText'] = elem['answerText']

    example = {}
    tasks = {}
    example['name'] = "Example 1"
    example['granularity'] = ""

    taskOrdering = []
    modifierOrdering = []

    documents = elem['documents']    
    idx = 1
    for document in documents:
        task = {}
        task['id'] = "task-" + str(idx)
        task['isRemoved'] = False
        task['isHoveredOver'] = False
        task['content'] = document['docText']
        task['relevance'] = document['relevance']
        task['score'] = document['score']
        task['bgcolor'] = "#FFFFFF"
        task['uuid'] = document['uuid']

        tasks[task['id']] = task
        taskOrdering.append(task['id'])

        idx += 1

        # Add remove marker at position 4
        if (idx == 4):
            taskOrdering.append(removeMarker['id'])

        #goldRole = document['goldRole']

    # Also add remove marker
    tasks[removeMarker['id']] = removeMarker

    # Pack
    example['tasks'] = tasks
    example['taskOrdering'] = taskOrdering
    example['modifierOrdering'] = modifierOrdering
    oneQuestion['examples'] = [example]

    # Add to master questions list
    questionData.append(oneQuestion)

    print(oneQuestion)

    print("")


# Step 3: Pack

packed = {}
packed['discourseMarkers'] = discourseMarkers
packed['sampleData'] = {"questionData": questionData}

print(" Writing " + filenameOut)
with open(filenameOut, 'w') as jsonFile:
    jsonFile.write( json.dumps(packed, indent=4, sort_keys=False) )
