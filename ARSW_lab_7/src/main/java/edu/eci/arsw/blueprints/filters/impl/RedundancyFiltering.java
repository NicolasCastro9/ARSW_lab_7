package edu.eci.arsw.blueprints.filters.impl;

import edu.eci.arsw.blueprints.filters.BlueprintsFilters;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class RedundancyFiltering implements BlueprintsFilters {

    @Override
    public Blueprint filter(Blueprint blueprint) {
        List<Point> points = blueprint.getPoints();
        List<Point> filterPoints = new ArrayList<>();

        for (int i = 0; i < points.size() - 1; i++) {
            Point punto = points.get(i);
            Point sigPunto = points.get(i + 1);
            if (punto.getX() != sigPunto.getX() && punto.getY() != sigPunto.getY()) {
                filterPoints.add(punto);
            }
            if ( i ==  points.size() - 2) {
                filterPoints.add(points.get(points.size() - 1));
            }
        }
        
        blueprint.setPoints(filterPoints);
        return blueprint;
    }

    @Override
    public Set<Blueprint> filters(Set<Blueprint> blueprints) {
        for (Blueprint bluePrint : blueprints) {
            filter(bluePrint);
        }
        return blueprints;
    }

}
