const sampleData = 
    [{
        questionText: "text",
        answerText: "text2",
        examples: [
            {   name: "Example 1",
                granularity: "medium", 
                tasks: {
                    'task-1': { id: 'task-1', isRemoved: false, isHoveredOver: false, content: 'melting means matter / a substance changes from a solid into a liquid by increasing heat energy', relevance: 4, score: 0.38 },
                    'removemarker': { id: 'removemarker', isRemoved: true, isHoveredOver: false, content: 'Remove Marker' },
                    'aboutmarker': { id: 'aboutmarker', isRemoved: true, isHoveredOver: false, content: 'This question is about [QuestionClass]. ' },
                    'coremarker': { id: 'coremarker', isRemoved: true, isHoveredOver: false, content: 'The core concepts to know to answer this question are: ' },
                    'othermarker': { id: 'othermarker', isRemoved: true, isHoveredOver: false, content: 'Other facts that help answer this question are: ' },
                },
                taskOrdering: ['task-1', 'removemarker', ],
                modifierOrdering: [],
            }
            ],
        }    
    ]

export default sampleData;