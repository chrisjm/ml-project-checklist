import type { ChecklistSection, ChecklistItem } from '$lib/types';
import { newId } from '$lib/types';

// Manually curated template derived from src/lib/data/ml-project-checklist-template.md

const frameTheProblemItems: string[] = [
	'Define the objective in business terms',
	'How will your solution be used?',
	'What are the current solutions/workarounds (if any)?',
	'How should you frame this problem (supervised/unsupervised, online/offline, etc.)?',
	'How should performance be measured?',
	'Is the performance measure aligned with the business objective?',
	'What would be the minimum performance needed to reach the business objective?',
	'What are comparable problems? Can you reuse experience or tools?',
	'Is human expertise available?',
	'How would you solve the problem manually?',
	'List the assumptions you (or others) have made so far?',
	'Verify assumptions if possible'
];

const getTheDataItems: string[] = [
	'List the data you need and how much you need',
	'Find and document where you can get that data',
	'Check how much space it will take',
	'Check legal obligations, and get authorization if necessary',
	'Get access authorization',
	'Create a workspace (with enough storage space)',
	'Get the data',
	'Convert the data to a format you can easily manipulate (without changing the data itself)',
	'Ensure sensitive information is deleted or protected (e.g., anonymized)',
	'Check the size and type of data (time series, geospatial, etc.)',
	'Sample a test set, put it aside, and never look at it (no data snooping!)'
];

const discoverVisualizeItems: string[] = [
	'Create a copy of the data for exploration (sampling it down to a manageable size if necessary)',
	'Create a Jupyter notebook to keep a record of your data exploration',
	'Study each attribute and its characteristics',
	'For supervised learning tasks, identify the target attribute(s)',
	'Visualize the data',
	'Study the correlations between attributes',
	'Study how you would solve the problem manually',
	'Identify the promising transformation you may want to apply',
	'Identify extra data that would be useful (go back to "Get the Data")',
	'Document what you have learned'
];

const attributeDetailSubitems: string[] = [
	'Name',
	'Type (categorical, int/float, bounded/unbounded, text, structured, etc.)',
	'% of missing values',
	'Noisiness and type of noise (stochastic, outliers, rounding errors, etc.)',
	'Usefulness for the task',
	'Type of distribution (Gaussian, uniform, logarithmic, etc.)'
];

const prepareDataItems: string[] = [
	'Work on copies of the data (keep the original dataset intact)',
	'Write functions for all data transformations you apply',
	'Data cleaning',
	'Feature selection (optional)',
	'Feature engineering, where appropriate',
	'Feature scaling (almost always!)'
];

const transformationReasonsSubitems: string[] = [
	'So you can easily prepare the data the next time you get a fresh dataset',
	'So you can apply these transformations in future projects',
	'To clean and prepare the test set',
	'To clean and prepare new data instances once your solution is live',
	'To make it easy to treat your preparation choices as hyperparameters'
];

const dataCleaningSubitems: string[] = [
	"Fix or remove outliers (optional and only as you move along so you're not doing extra work)",
	'Fill in missing values (e.g., with zero, mean, median...) or drop their rows (or columns); again optional and same rules as above.'
];

const featureEngineeringSubitems: string[] = [
	'Discretize continuous features',
	'Decompose features (e.g., categorical, date/time, etc.)',
	'Add promising transformations of features (e.g. log(x), sqrt(x), x^2, etc.)',
	'Aggregate features into promising new features'
];

const featureScalingSubitems: string[] = ['Standardize or normalize features'];

const selectTrainModelItems: string[] = [
	'Train many quick-and-dirty models from different categories (e.g., linear, naive Bayes, SVM, Random Forest, neural net, etc.) using standard parameters',
	'Measure and compare their performance',
	'Analyze the most significant variables for each algorithm',
	'Analyze the types of errors the models make',
	'Perform a quick round of feature selection and engineering',
	'Perform one or two more quick iterations of the five previous steps',
	'Shortlist the top three to five most promising models, preferring models that make different types of errors'
];

const selectTrainNotesSubitems: string[] = [
	'NOTE: If the data is huge, you may want to sample smaller training sets so that you can train many different models in a reasonable time (be aware that this penalizes complex models such as large neural nets or Random Forests)'
];

const measureCompareSubitems: string[] = [
	'For each model, use N-fold cross validation and compute the mean and standard deviation of the performance measure on the N folds'
];

const errorsModelsSubitems: string[] = ['What data would a human have used to avoid these errors?'];

const fineTuneItems: string[] = [
	'Fine-tune the hyperparameters using cross-validation',
	'Try Ensemble methods. Combining your best model will often produce better performance than running them individually',
	'Once you are confident about your final model, measure its performance on the test set to estimate the generalization error.'
];

const fineTuneSubitems: string[] = [
	"Treat your data transformation choices as hyperparameters, especially when you are not sure about them (e.g., if you're not sure whether to replace missing values with zeros or with the median value, or to just drop the rows)",
	'Unless there are very few hyperparameter values to explore, prefer random search over grid search. If training is very long, you may prefer a Bayesian optimizer approach (e.g., using Gaussian process priors)',
	"Don't tweak your model after measuring the generalization error: you would just start overfitting the test set."
];

const presentSolutionItems: string[] = [
	'Document what you have done.',
	'Create a nice presentation',
	'Explain why your solution achieves the business objective',
	"Don't forget to present interesting points you noticed along the way",
	'Ensure your key findings are communicated through beautiful visualizations or easy-to-remember statements (e.g., "the median income is the number-one predictor of housing prices")'
];

const presentationSubitems: string[] = [
	'Make sure you highlight the big picture first',
	'Describe what worked and what did not',
	"List your assumptions and your system's limitations"
];

const launchMonitorMaintainItems: string[] = [
	'Get your solution ready for production (plug into production data inputs, write unit tests, etc.)',
	"Write monitoring code to check your system's live performance at regular intervals and trigger alerts when it drops",
	'Retrain your models on a regular basis on fresh data (automate as much as possible)'
];

const monitoringSubitems: string[] = [
	'Beware of slow degradation: models tend to "rot" as data evolves',
	'Measuring performance may require a human pipeline (e.g., via a crowdsourcing service)',
	"Also monitor your inputs' quality (e.g., a malfunctioning sensor sending random values, or another team's output becoming stale). This is particularly important for online learning systems."
];

function makeItems(texts: string[]): ChecklistItem[] {
	return texts.map((text) => ({ id: newId(), text, checked: false }));
}

export function createDefaultSections(): ChecklistSection[] {
	return [
		{
			id: newId(),
			title: 'Frame the Problem; Look at the big picture',
			items: makeItems(frameTheProblemItems),
			notes: ''
		},
		{
			id: newId(),
			title: 'Get the data',
			items: makeItems(getTheDataItems),
			notes: ''
		},
		{
			id: newId(),
			title: 'Discover and visualize the data to gain insights',
			items: [
				...makeItems(discoverVisualizeItems.slice(0, 2)),
				// Attribute details as one parent checklist item, followed by sub-bullets inline for reference
				{ id: newId(), text: 'Study each attribute and its characteristics', checked: false },
				...makeItems(attributeDetailSubitems.map((s) => `  - ${s}`)),
				...makeItems(discoverVisualizeItems.slice(3))
			],
			notes: ''
		},
		{
			id: newId(),
			title: 'Prepare the data for ML algorithms',
			items: [
				{ id: newId(), text: prepareDataItems[0], checked: false },
				{ id: newId(), text: prepareDataItems[1], checked: false },
				...makeItems(transformationReasonsSubitems.map((s) => `  - ${s}`)),
				{ id: newId(), text: prepareDataItems[2], checked: false },
				...makeItems(dataCleaningSubitems.map((s) => `  - ${s}`)),
				{ id: newId(), text: prepareDataItems[3], checked: false },
				...makeItems(['  - Drop the attributes that provide no useful information for the task']),
				{ id: newId(), text: prepareDataItems[4], checked: false },
				...makeItems(featureEngineeringSubitems.map((s) => `  - ${s}`)),
				{ id: newId(), text: prepareDataItems[5], checked: false },
				...makeItems(featureScalingSubitems.map((s) => `  - ${s}`))
			],
			notes: ''
		},
		{
			id: newId(),
			title: 'Select a model and train it',
			items: [
				...makeItems(selectTrainNotesSubitems.map((s) => `NOTE: ${s}`)),
				...makeItems(selectTrainModelItems),
				...makeItems(measureCompareSubitems.map((s) => `  - ${s}`)),
				...makeItems(errorsModelsSubitems.map((s) => `  - ${s}`))
			],
			notes: ''
		},
		{
			id: newId(),
			title: 'Fine-tune your model',
			items: [...makeItems(fineTuneItems), ...makeItems(fineTuneSubitems.map((s) => `  - ${s}`))],
			notes: ''
		},
		{
			id: newId(),
			title: 'Present your solution',
			items: [
				...makeItems(presentSolutionItems),
				...makeItems(presentationSubitems.map((s) => `  - ${s}`))
			],
			notes: ''
		},
		{
			id: newId(),
			title: 'Launch, monitor, and maintain your system',
			items: [
				...makeItems(launchMonitorMaintainItems),
				...makeItems(monitoringSubitems.map((s) => `  - ${s}`))
			],
			notes: ''
		}
	];
}
