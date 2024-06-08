// Dependencies
import TypeSpec from "../TypeSpec/index.js";            // Type checking
import TypeSpecError from "../TypeSpecError/index.js";  // Error handling

// Creates an optimized instance of TPYESPEC be using precomputed functions for checking, creating, and updating instances of TYPESPEC with:
export default class TypeSpecBuild {

    /* Instance Field */

    _create; // Stores precomputed "create" function for creating constrained objects defined by a TYPESPEC instance
    _check;  // Stores  precomputed "check" function for ensuring an object is a valid for some instance of TYPESPEC
    _udpate; // Stores precomputed "update" function for updatin a constrained object defined by a TYPESPEC instance

    // CONSTRUCTOR :: STRING, {STRING:OBJECT} -> this
    constructor(typeName, props) { 
        this.typeName = typeName;
        this.check = TypeSpecBuild.buildCheck(this.typeName, props);
        this.create = TypeSpecBuild.buildCreate(this.typeName, props);
        //this.update = TypeSpecBuild.buildUpdate(this.typeName, propsCopy);
    }

    /**
     *
     *  Properties  
     * 
     */

    /*========*
     * create *
     *========*/

    // SETTER :: FUNCTION -> VOID
    set create(create) {
        if (TypeSpec.FUNCTION(create) === true) {
            this._create = create;
        } else {
            throw new TypeSpecError("'create' function must be a FUNCTION", TypeSpecError.CODE.INVALID_VALUE)
        }
    }

    // GETTER :: VOID -> FUNCTION
    get create() {
        return this._create;
    }

    /*=======*
     * check *
     *=======*/

    // SETTER :: FUNCTION -> VOID
    set check(check) {
        if (TypeSpec.FUNCTION(check) === true) {
            this._check = check;
        } else {
            throw new TypeSpecError("'check' function must be a FUNCTION", TypeSpecError.CODE.INVALID_VALUE)
        }
    }

    // GETTER :: VOID -> FUNCTION
    get check() {
        return this._check;
    }

    /*========*
     * update *
     *========*/


    /**
     * 
     * 
     *  Instace Methods  
     * 
     */

    // :: * -> BOOL
    // Returns TRUE if value "is of" this instance of TYPESPEC
    isOf(value) {
        try {
            this.check(value);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * 
     *  Static Methods
     * 
     */

    // Static Factory Method :: STRING, {STRING:OBJECT} -> TYPESPECBUILD
    static init(typeName, props) {
        return new TypeSpecBuild(typeName, props);
    }


    // :: STRING, {STRING:OBJECT} -> (OBJECT -> OBJECT)
    // Precompute "create" function using TYPESPEC prop definitions:
    static buildCreate(typeName, props) {

         // Create a conditional for each check so we can avoid iterating over an array of checks:
         const checks = Object.keys(props).reduce((result, prop) => {
            return result += `if (args["${prop}"] === undefined) {
                if (props["${prop}"].required === false) {
                    instance["${prop}"] = props["${prop}"].defaultValue
                } else {
                    throw new Error("Property '${prop}' missing from TYPESPEC instance '${typeName}");
                }
            } else if (props["${prop}"].check(args["${prop}"]) !== true) {
                throw new Error("Property '${prop}' of TYPESPEC instance '${typeName}' failed check");
            } else {
                instance["${prop}"] = args["${prop}"];
            };`
         }, "");

         // Defines function body for optimized check:
         // NOTE: We curry this function so that we can store our "props" to validate with in a short-lived closure that binds those values to the check function we are trying to precompute:
         const body = `return function(args) {
            let instance = {};
            ${checks}
            return instance;
        }`;
    
        return new Function("props", body)(props);

    }
 
    // :: STRING, {STRING:OBJECT} -> (OBJECT -> OBJECT)
    // Precompute "check" function using TYPESPEC prop definitions:
    static buildCheck(typeName, props) {

        // Create a conditional for each check so we can avoid iterating over an array of checks:
        const checks = Object.keys(props).reduce((result, prop) => {
            return result += `if (instance["${prop}"] === undefined) {
                throw new Error("Property '${prop}' missing from TYPESPEC instance '${typeName}");
            } else if (props["${prop}"].check(instance["${prop}"]) !== true) {
                throw new Error("Property '${prop}' of TYPESPEC instance '${typeName}' failed check");
            } else {
                propInstanceCount--;
            };`
         }, `let propInstanceCount = Object.keys(instance).length;`);
         
         // Defines function body for optimized check:
         // NOTE: We curry this function so that we can store our "props" to validate with in a short-lived closure that binds those values to the check function we are trying to precompute:
         const body = `return function(instance) {
             ${checks}
             if (propInstanceCount !== 0) {
                 throw new Error("Instance of '${typeName}' includes unsupported properties!");
             };
             return instance;
         }`;
     
         return new Function("props", body)(props);

    }

 

}