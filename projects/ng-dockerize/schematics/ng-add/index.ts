import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';

// Just return the tree
export function ngAdd(_options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {

    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('init', _options), [installTaskId]);
  };
}