/*
 * This file is a component of env.js, 
 *     http://github.com/gleneivey/env-js/commits/master/README
 * a Pure JavaScript Browser Environment
 * Copyright 2009 John Resig, licensed under the MIT License
 *     http://www.opensource.org/licenses/mit-license.php
 *
 *  Contributed by Glen E. Ivey
 */


package org.mozilla.javascript.tools.envjs;

import org.mozilla.javascript.Context;

public class Global extends org.mozilla.javascript.tools.shell.Global
{

    public Global(org.mozilla.javascript.tools.shell.Global parentSharedScope)
    {
        this.setPrototype(parentSharedScope);
        this.setParentScope(null);
    }

    public void init(Context cx)
    {
        // we don't init, but make sure our parent is
        org.mozilla.javascript.tools.shell.Global uberGlobal = 
        	(org.mozilla.javascript.tools.shell.Global) this.getPrototype();
        if (!uberGlobal.isInitialized())
            uberGlobal.init(cx);
    }

    public boolean isInitialized()
    {
        return ((org.mozilla.javascript.tools.shell.Global) this.getPrototype()).isInitialized();
        //   some users of Global access .initialized directly (bad class, bad!),
        //   and will be confused by the fact that we don't set it.  However,
        //   unnecessary calls to .init() will simply do nothing, so....
    }
}
