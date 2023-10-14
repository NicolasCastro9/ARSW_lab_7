package edu.eci.arsw.blueprints.filters;

import edu.eci.arsw.blueprints.model.Blueprint;
import java.util.Set;

public interface BlueprintsFilters {
    
    public Blueprint filter(Blueprint blueprint);
    
    public Set<Blueprint> filters(Set<Blueprint> blueprints);
    
}
