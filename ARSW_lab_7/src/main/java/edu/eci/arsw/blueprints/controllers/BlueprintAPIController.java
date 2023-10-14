/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.logging.Level;
import java.util.logging.Logger;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.services.BlueprintsServices;



/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    
    @Autowired
    //@Qualifier("Service")
    BlueprintsServices bps;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getBlueprint(){
        try{
            return new ResponseEntity<>(bps.getAllBlueprints(), HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error",HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(value = "/{author}",method = RequestMethod.GET)
    public ResponseEntity<?> getBlueprint(@PathVariable("author") String author){
        try{
            return new ResponseEntity<>(bps.getBlueprintsByAuthor(author), HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error",HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value="/{author}/{name}", method = RequestMethod.GET)
    public ResponseEntity<?>  manejadorBlueprint(@PathVariable("author") String author,@PathVariable("name") String name ){
        try {
            return new ResponseEntity<>(bps.getBlueprint(author,name), HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> postBlueprint(@RequestBody Blueprint blueprint) throws BlueprintNotFoundException{
        try {
            bps.addNewBlueprint(blueprint);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (BlueprintPersistenceException ex) {
            //Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se registro",HttpStatus.FORBIDDEN);
        }

    }

    @RequestMapping(path = "/{author}/{bpname}", method = RequestMethod.PUT)
    public ResponseEntity<?> putBlueprint(@PathVariable String author, @PathVariable String bpname, @RequestBody Blueprint blueprint){
        Blueprint blueprintNew = null;
        try {
            blueprintNew = bps.getBlueprint(author, bpname);

            blueprintNew.setAuthor(blueprint.getAuthor());
            blueprintNew.setName(blueprint.getName());
            blueprintNew.setPoints(blueprint.getPoints());

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException e) {
            return new ResponseEntity<>("Espera",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}

