
package edu.eci.arsw.blueprints.filters.impl;

import edu.eci.arsw.blueprints.filters.BlueprintsFilters;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
//import org.springframework.stereotype.Service;

//@Service
public class UndersamplingFiltering implements BlueprintsFilters{

    @Override
    public Blueprint filter(Blueprint blueprint) {
        List<Point> points = blueprint.getPoints();
        List<Point> filterPoints = new ArrayList<>();
        
        for(int i = 0; i < points.size(); i = i + 2){
            filterPoints.add(points.get(i));
        }
        blueprint.setPoints(filterPoints);
        return blueprint;
    }

    @Override
    public Set<Blueprint> filters(Set<Blueprint> blueprints) {
        for (Blueprint bluePrint : blueprints){
            filter(bluePrint);
        }
        return blueprints;
    }
    
}
