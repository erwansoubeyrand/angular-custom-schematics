import {
	apply,
	mergeWith,
	move,
	Rule,
	SchematicContext,
	SchematicsException,
	template,
	Tree,
	url,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { buildDefaultPath } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function customComponent(_options: SchematicsCustomComponent): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const workspace = tree.read('angular.json');
		if (!workspace) {
			throw new SchematicsException('Not an angular cli project !');
		}

		const workspaceConfig = JSON.parse(workspace.toString());
		console.log('workspace', workspaceConfig);
		const projectName = _options.project || workspaceConfig.defaultProject;
		console.log('projectName', projectName);
		const project = workspaceConfig.projects[projectName];
		console.log('project', project);

		const defaultProjectPath = buildDefaultPath(project);
		console.log('defaultProjectPath', defaultProjectPath);

		const parsedPath = _options.name ? parseName(defaultProjectPath, _options.name) : '';
		if (parsedPath) {
			_options.name = parsedPath.name;
			_options.path = parsedPath.path;
		}

		const sourceTemplate = url('./files');
		const sourceParametrizedTemplate = apply(sourceTemplate, [
			template({
				..._options,
				...strings,
			}),
			move(_options.path || ''),
		]);

		return mergeWith(sourceParametrizedTemplate)(tree, _context);
	};
}
