/** All required remote dependencies are referenced in this file and the required methods
 * and classes are re-exported. The dependent local modules then reference the deps.ts rather
 * than the remote dependencies. If now for example one remote dependency is used in several files,
 * upgrading to a new version of this remote dependency is much simpler as this can be done just
 * within deps.ts.
 */