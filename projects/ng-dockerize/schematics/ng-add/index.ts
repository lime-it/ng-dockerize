import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency } from 'schematics-utilities';

const dependencies:NodeDependency[] = [
  // {
  //   type: NodeDependencyType.Default,
  //   name: "apollo-angular",
  //   version: "^1.9.1",
  //   overwrite:true
  // }
];

// Just return the tree
export function ngAdd(_options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    console.log('Adding dependencies...\n');
    dependencies.forEach(dep => addPackageJsonDependency(tree, dep));

    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('init', _options), [installTaskId]);
  };
}