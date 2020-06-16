import {
  Rule, Tree, SchematicsException
} from '@angular-devkit/schematics';

import { experimental } from '@angular-devkit/core';

import { Schema as InitSchema } from './schema';

export function Initialize(options: InitSchema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    // convert workspace to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(workspaceContent);
    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;

    const project = workspace.projects[projectName];

    if (project.projectType !== 'application') {
      throw new SchematicsException('Only "application" projects can be initialized.');
    }

    // const appPath = `${project.sourceRoot}/app`;

    // const templateSource = apply(url('./files'), [
    //   applyTemplates({
    //     classify: strings.classify,
    //     dasherize: strings.dasherize,
    //     name: options.name
    //   }),
    //   move(normalize(options.path as string))
    // ]);

    // return chain([
    //   mergeWith(templateSource)
    // ]);

    console.log(projectName)

    return tree;
  };
}