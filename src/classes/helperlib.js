export default class HelperLib {

    static newCopyOfObject(o){

        var result = {};
      
        Object.keys(o).forEach(function(key){
            var v = o[key];
            if ( typeof(v) == "object" )
                if ( Array.isArray(v) )
                    result[key] = v.slice();
                else
                    result[key] = HelperLib.objectCopy(v);
            else
            result[key] = v;
        })
      
      return result;
    }

}