/**
 * Author : Vasantha Hassan Ravikumar 
 */
var projection;
var svg;
var scaleFactor;
function usStates(){
	
	
	var mapData = "us-sates.json";//"http://eric.clst.org/wupl/Stuff/gz_2010_us_040_00_500k.json";
	//console.log("json"+mapData);
	/*$.getJSON(mapData, function(data) {
		  console.log(data);
		});*/
	
	var w =600;
	var h = 400;
	var path, center, scale, bounds, hscale, vscale, offset, xy;
	
	d3.json(mapData, function(error, collection) {
		if(error){
			console.log(error.response);
		}
		
		scale=700;
		projection = d3.geo.albersUsa()
	    .scale(scale)
	    .translate([w / 2, h / 2])
	    .precision(.1);
		
		
		path = d3.geo.path().projection(projection);
		
		
		svg = d3.select("#usmap")
		.insert("svg")
		.attr("width", w)
		.attr("height", h);
		
		
		var states = svg.append("g").attr("id", "states");
		
		
		
		queue()  
	    .defer(d3.json, mapData)
	    .defer(d3.csv,"all_2013_2014_2015.csv")
	    .defer(d3.csv,"edu_unemploy_demo.csv")
	    .await(visualize);
				
		
		function visualize(error, us, alldata, edudata ){
			
			states.selectAll("path")
			.data(us.features)
			.enter()
			.append("path")
			.attr("class","pathusmap")
			.attr("d", path)
			.style("fill", "#99CCFF")			
			.on("click", function(d) {				
				d3.selectAll(".pathusmap").style("fill", "#99CCFF");					
					d3.select(this)
					.style("fill", "#6C0")
					.append("title")
					.text(d.properties.NAME);		
					
				//	console.log("222d.properties.name"+d.properties.NAME);		
					d3.select("#readmissioLineGraph").selectAll("*").remove();
					//d3.selectAll(".startReadmissioLineGraph").remove();					
					var gg=readmissionLineGraph(d.properties.NAME);
					//console.log("vvvvvvvvvvvvvvv"+gg);
					//sleep(2000);
					education(d.properties.NAME, alldata,edudata );
					raceEtimation(d.properties.NAME,alldata, edudata);
					popPoverty(d.properties.NAME,alldata, edudata);
					ageChart(d.properties.NAME,alldata, edudata);
					classChart(d.properties.NAME,alldata, edudata);
					penaltychart(d.properties.NAME,alldata, edudata);
					readNoCasechart(d.properties.NAME,alldata, edudata);
			})
			.on("mouseover", function(d) {
				d3.select(this)
				.append("title")
				.text(d.properties.NAME);
				
			}); 
			
		}
		
	/*	d3.json(mapData, function(us){
			//console.log("d.properties.name"+JSON.stringify(us.features));
			states.selectAll("path")
			.data(us.features)
			.enter()
			.append("path")
			.attr("class","pathusmap")
			.attr("d", path)
			.style("fill", "#99CCFF")
			
			.on("click", function(d) {				
				d3.selectAll(".pathusmap").style("fill", "#99CCFF");					
					d3.select(this)
					.style("fill", "#6C0")
					.append("title")
					.text(d.properties.name);
					console.log("222d.properties.name"+d.properties.NAME);		
							
					education(d.properties.NAME);
			}); 
			
		});*/
		
	});
}

function readmissionLineGraph(name){
	var finalData=[];
	var width =600-70-20;
	var height = 400;
	var uniqueTicks = [];
	var xTickFormat;
	
	var x= d3.scale.linear()
			.range([0, width]),
			
			y= d3.scale.linear()
			.range([height,0]),
				
		xAxis= d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickValues(["2012","2013","2014","2015","2016"]),		
		
	yAxis= d3.svg.axis()
			.scale(y)
			.orient("left"),
	
	line= d3.svg.line()
			.x(function(d){return x(d.year)})
			.y(function(d){return y(d.count)});

/*	xTickFormat = d3.time.format.multi([
	                                    ["%Y", function (d) {
	                                        if (uniqueTicks.indexOf(d.getFullYear()) === -1) {
	                                            uniqueTicks.push(d.getFullYear());
	                                            return d3.time.format("%Y");
	                                        } else {
	                                            return false;
	                                        }                                        
	                                    }],
	                                    ["", function () {
	                                        return true;
	                                    }]
	                                ]);*/
	
	
	
	d3.csv("all_2013_2014_2015.csv", function(error,data){
		
		if(error){
			console.log("wrong data");
			
		}
		//console.log("without stringify proper data"+data);
	//	console.log("proper data"+JSON.stringify(data));
		var  sepData=[];
		
		if(name==null){
			//console.log("ffffffffffffffffff"+name);
			var sumPn2013=d3.mean(data, function(value){ return value.Excess_Readmission_Ratio_for_Pneumonia_2013});
			newDataSet("Pneumonia", sumPn2013, "2013");
			var sumHf2013=d3.mean(data, function(value){ return value.Excess_Readmission_Ratio_for_Heart_Failure_2013});
			newDataSet("Heart Failure", sumHf2013, "2013");
			var sumAm2013=d3.mean(data, function(value){ return value.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2013});
			newDataSet("Acute Myocardial", sumAm2013, "2013");
			
			var sumPn2014=d3.mean(data, function(value){ return value.Excess_Readmission_Ratio_for_Pneumonia_2014});
			newDataSet("Pneumonia", sumPn2014, "2014");
			var sumHf2014=d3.mean(data, function(value){ return value.Excess_Readmission_Ratio_for_Heart_Failure_2014});
			newDataSet("Heart Failure", sumHf2014, "2014");
			var sumAm2014=d3.mean(data, function(value){ return value.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2014});
			newDataSet("Acute Myocardial", sumAm2014, "2014");
			
			
			var sumPn2015=d3.mean(data, function(value){ return value.Excess_Readm_Ratio_Pn_2015});
			newDataSet("Pneumonia", sumPn2015, "2015");
			var sumHf2015=d3.mean(data, function(value){ return value.Excess_Readm_Ratio_HF_2015});
			newDataSet("Heart Failure", sumHf2015, "2015");
			var sumAm2015=d3.mean(data, function(value){ return value.AMI_Excess_Readm_Ratio_2015_modified});
			newDataSet("Acute Myocardial", sumAm2015, "2015");
			
		}else{
			
			data.forEach(function(d){
				
				if(d.state_full_form==name){
					
					sepData.push({
						pn13:d.Excess_Readmission_Ratio_for_Pneumonia_2013,
						hf13:d.Excess_Readmission_Ratio_for_Heart_Failure_2013,
						am13:d.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2013,
							
						pn14:d.Excess_Readmission_Ratio_for_Pneumonia_2014,
						hf14:d.Excess_Readmission_Ratio_for_Heart_Failure_2014,
						am14:d.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2014,
							
						pn15:d.Excess_Readm_Ratio_Pn_2015,
						hf15:d.Excess_Readm_Ratio_HF_2015,
						am15:d.AMI_Excess_Readm_Ratio_2015_modified
								
							
					});
					
				}	
				
			});
			var sumPn2013=d3.mean(sepData, function(value){ return value.pn13});
			newDataSet("Pneumonia", sumPn2013, "2013");
			var sumHf2013=d3.mean(sepData, function(value){ return value.hf13});
			newDataSet("Heart Failure", sumHf2013, "2013");
			var sumAm2013=d3.mean(sepData, function(value){ return value.am13});
			newDataSet("Acute Myocardial", sumAm2013, "2013");
			
			var sumPn2014=d3.mean(sepData, function(value){ return value.pn14});
			newDataSet("Pneumonia", sumPn2014, "2014");
			var sumHf2014=d3.mean(sepData, function(value){ return value.hf14});
			newDataSet("Heart Failure", sumHf2014, "2014");
			var sumAm2014=d3.mean(sepData, function(value){ return value.am14});
			newDataSet("Acute Myocardial", sumAm2014, "2014");
			
			
			var sumPn2015=d3.mean(sepData, function(value){ return value.pn15});
			newDataSet("Pneumonia", sumPn2015, "2015");
			var sumHf2015=d3.mean(sepData, function(value){ return value.hf15});
			newDataSet("Heart Failure", sumHf2015, "2015");
			var sumAm2015=d3.mean(sepData, function(value){ return value.am15});
			newDataSet("Acute Myocardial", sumAm2015, "2015");
		}		
		
		
		function newDataSet(disease, sum, yr){			
			finalData.push({disease:disease, count:sum, year:yr});			
		}
		
		
		var finalDataSet= d3.nest()
							.key(function(t){return t.disease})
							.entries(finalData);
		
		var color = d3.scale.category10(); 
		
		x.domain(
				
				[
		          d3.min(finalData, function(data){return parseInt(data.year)-1}),
		          d3.max(finalData, function(data){return parseInt(data.year)+1})	         
		          ]);
		          
		          y.domain([
		          d3.min(finalData, function(data){return data.count}),
		          d3.max(finalData, function(data){return data.count})
		         
		          ]);
						
		          //console.log("d3.min(finalData, function(data){return data.year})"+d3.extent(finalData, function(d) { return d.year; }));
		          var svg;
		          d3.selectAll(".startReadmissioLineGraph").remove();
		          if(d3.selectAll(".startReadmissioLineGraph").empty()){
		        	   svg=d3.select("#readmissioLineGraph").append("svg")
						.attr("width", width+70+20)
						.attr("height", height+20+40)
						.append("g")
						.attr("class","startReadmissioLineGraph")
						.attr("transform", "translate(" + 60 + "," + 20 + ")");
		        	  
		          }
		      	
		          
		      svg.append("g")
			.attr("class","x axis")	
			.call(xAxis)			
			.attr("transform", "translate(0," + height + ")");
			
		
		svg.append("g")
		.attr("class","y axis")
		.call(yAxis)
		  .append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".75em")
	      .style("text-anchor", "end")
	      .text("Readmission Factor");     
		
		var dis = svg.selectAll(".dis")
	     .data(finalDataSet)
	    .enter().append("g")
	     .attr("class", "dis");
		
		dis.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("data-legend",function(d) { return d.key})
		.attr("id",function(d){ return d.key+"-readmission"; })	   
	    .style("stroke", function(d) { 
	    	//console.log(d.key+" color(d.key)"+ color(d.key));	    	
	    	return color(d.key); })
	    .attr("d",function(d){
	    	//console.log(" d.values"+ JSON.stringify(d.values));
	    	return line(d.values)});
		
		var mouseG = svg.append("g")
	      .attr("class", "mouse-over-effects");
		
		  mouseG.append("path") // this is the black vertical line to follow mouse
		    .attr("class", "mouse-line")
		    .style("stroke", "black")
		    .style("stroke-width", "1px")
		    .style("opacity", "0");
		    
		  var lines = document.getElementsByClassName('line');

		  var mousePerLine = mouseG.selectAll('.mouse-per-line')
		    .data(finalDataSet)
		    .enter()
		    .append("g")
		    .attr("class", "mouse-per-line");

		  mousePerLine.append("circle")
		    .attr("r", 7)
		    .style("stroke", function(d) {
		      return color(d.key);
		    })
		    .style("fill", "none")
		    .style("stroke-width", "2px")
		    .style("opacity", "0");

		  mousePerLine.append("text")
		    .attr("transform", "translate(10,3)")
		    .attr("class","tooltip")
		    .style("font-size", "13px")
		    .style("font-weight","bold");
		    
		    

		  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
		    .attr('width', width) // can't catch mouse events on a g element
		    .attr('height', height)
		    .attr('fill', 'none')
		    .attr('pointer-events', 'all')
		    .on('mouseout', function() { // on mouse out hide line, circles and text
		      d3.select(".mouse-line")
		        .style("opacity", "0");
		      d3.selectAll(".mouse-per-line circle")
		        .style("opacity", "0");
		      d3.selectAll(".mouse-per-line text")
		        .style("opacity", "0");
		    })
		    .on('mouseover', function() { // on mouse in show line, circles and text
		      d3.select(".mouse-line")
		        .style("opacity", "1");
		      d3.selectAll(".mouse-per-line circle")
		        .style("opacity", "1");
		      d3.selectAll(".mouse-per-line text")
		        .style("opacity", "1");
		    })
		    .on('mousemove', function() { // mouse moving over canvas
		      var mouse = d3.mouse(this);
		      d3.select(".mouse-line")
		        .attr("d", function() {
		          var d = "M" + mouse[0] + "," + height;
		          d += " " + mouse[0] + "," + 0;
		          return d;
		        });
		      var ypos = [];
		      d3.selectAll(".mouse-per-line")
		        .attr("transform", function(d, i) {         
		          var xDate = x.invert(mouse[0]),
		              bisect = d3.bisector(function(d) { return d.date; }).right;
		              idx = bisect(d.values, xDate);
		          
		          var beginning = 0,
		              end = lines[i].getTotalLength(),
		              target = null;

		          while (true){
		            target = Math.floor((beginning + end) / 2);
		            pos = lines[i].getPointAtLength(target);
		            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
		                break;
		            }
		            if (pos.x > mouse[0])      end = target;
		            else if (pos.x < mouse[0]) beginning = target;
		            else break; //position found
		          }
		          
		          var key=d.key;
		          var time = new Date(x.invert(pos.x)).toLocaleTimeString();
		          d3.select(this).select('text')
		          .attr("class","tooltip")
		           .text(key+":"+y.invert(pos.y).toFixed(4));   
		             
		          ypos.push ({ind: i, y: pos.y, off: 0});  
		          
		          return "translate(" + mouse[0] + "," + (pos.y) +")";
		        })
		        .call(function(sel) {
		      ypos.sort (function(a,b) { return a.y - b.y; });
		      ypos.forEach (function(p,i) {
		          if (i > 0) {
		          var last = ypos[i-1].y;
		         ypos[i].off = Math.max (0, (last + 15) - ypos[i].y);
		          ypos[i].y += ypos[i].off;
		        }
		      })
		      ypos.sort (function(a,b) { return a.ind - b.ind; });
		    })
		    // Use the offset to move the tip text from it's g element
		    // don't want to move the circle too
		    .select("text")
		      .attr("transform", function(d,i) {
		          return "translate (10,"+(3+ypos[i].off)+")";
		      });         
		      
		    });
		  
		  var legend = svg.selectAll('.legend')
		    .data(finalDataSet)
		    .enter().append('g')
		    .attr('class', 'legend');

		legend.attr("transform", function(d,i){return "translate(0," + 20+")";})
		.attr('id',function(d){ return d; });

		legend.append('rect')
		    .attr('x', width - 80)
		    .attr('y', function(d, i){ return (i*20)-10;})
		    .attr('width', 10)
		    .attr('height', 10)
		    .style('fill', function(d) { 
		      return color(d.key);
		    });

		legend.append('text')
		    .attr('x', width - 60)
		    .attr('y', function(d, i){ return (i *20);})
		    .text(function(d){ return d.key; });
		
	});	
	
	return 1;
}

function education(name,alldata, edudata){
	
	//console.log(name+" JSON.stringify(d.values)"+JSON.stringify(data));
	
	var finalData=[];
	var width = 600,
    height = 400,
    radius = Math.min(width, height) / 2;
	
	
	var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
	
	var pie=d3.layout.pie()
				.sort(null)
				.value(function(d){ 
					//console.log(" return d.population"+d.population);
					return d.population});
	var svg;
	
	d3.selectAll(".edupiestart").remove();
	if(d3.selectAll(".edupiestart").empty()){
		//d3.selectAll("#educationLevel").remove();
		 svg= d3.select("#educationLevel").append("svg")
		 .attr("width", width)
		 	.attr("height", height)
		 	.attr("class","edupiestart")
		 	.append("g")
		    .attr("transform", "translate(" + ((width / 2)-100)+ "," + (height / 2) + ")");
	}
	
	
	
	
	var newSet=[];
	
/*	var map = d3.map(edudata, function(d) { return d.CHSI_State_Name; });
	map.get("foo"); // {"name": "foo"}
	console.log("Al99999999999999____"+JSON.stringify(map.get(name)));*/
	//console.log("Al99999999999999____"+JSON.stringify(name));
	edudata.forEach(function(d){
		
		if(d.CHSI_State_Name==name){
			newSet.push({
				adults_with_less_than_highschool:d.adults_with_less_than_highschool,
				adults_highschool:d.adults_highschool,
				adults_compl_associate_s_degree:d.adults_compl_associate_s_degree,
				adults_bachelor_s_degree_higher:d.adults_bachelor_s_degree_higher
			})
		}
		
	});
			
	//console.log("Al99999999999999____"+JSON.stringify(newSet));
	
	var avgELH=d3.mean(newSet, function(value){ return value.adults_with_less_than_highschool});
	newDataSet("Adult Less Than Highschool", avgELH);
	var avgEGH=d3.mean(newSet, function(value){ return value.adults_highschool});
	newDataSet("Adult Highschool", avgEGH);
	var avgEAD=d3.mean(newSet, function(value){ return value.adults_compl_associate_s_degree});
	newDataSet("Adult Associate Degree", avgEAD);
	var avgEBD=d3.mean(newSet, function(value){ return value.adults_bachelor_s_degree_higher});
	newDataSet("Adult Bachelor Degree", avgEBD);
	
	
	
	var color = d3.scale.category10(); 
	function newDataSet(edName,ppl){			
		finalData.push({education:edName, population:ppl});			
	}
	
	//console.log(" 11111111111JSON.stringify(d.values)"+JSON.stringify(finalData));
	var arcOver = d3.svg.arc()
    .innerRadius(radius + 5)
    .outerRadius(  180 + 5);
	
	//remove textTop and textBottom,, not used in the code
	 var textTop = svg.append("text")     
      /* .attr("translate",function(d){return arc.centroid(d)})*/
     .style("text-anchor", "top")
     .attr("class", "textTop")
     /*.text(function(d){return d.value})*/
     .attr("y", -10),
    /* .attr("y", 10)
     .attr("x", width-100),*/
    
     
 textBottom = svg.append("text")
     .attr("dy", ".35em")
     .style("text-anchor", "top")
     .attr("class", "textBottom")
   /*  .text(d)*/
     .attr("y",10);
    
	
		var pieChart= svg.selectAll(".edupiechart")
						.data(pie(finalData))
						.enter()
						.append("g")
						.attr("class", "edupiechart")
						.on("mouseover", function (d) {						
						
						d3.select(this).select("path").transition()
                        .duration(100)
                        .attr("d", arcOver)  ;    
                       /* console.log("llllllllllllllll"+ JSON.stringify(d3.select(this).datum().startAngle));
						console.log("mmmmmmmm"+ d3.select(this).datum().endAngle );
                    textTop( d3.select(this));
                    textBottom.text( d3.select(this).datum().value.toFixed(0))*/

					})
					    .on("mouseout", function () {
					    	  d3.select(this).select("path").transition()
		                         .duration(100)
		                         .attr("d", arc);

		                  //   textTop.text( "TOTAL" )
		                   //  textBottom.text( "m");
					});
		
		pieChart.append("path")
				.attr("class","pathedupiechart")
				.attr("d", arc)
				.attr("fill",function(d){
					//console.log(name+" JSON.stringify(d.values)"+color(d.data.education));
					return color(d.data.education)});
					
		
		
		
		pieChart.append("text")
				  .attr("transform", function (d) {
					  //console.log("hhhhhhhhhh"+arc.centroid(d));
					  return "translate(" + arc.centroid(d) + ")";
				  	}) .attr("text-anchor", "middle")
			    .text(function (d) {
			    	//console.log("hhhhhhhhhh"+JSON.stringify(d));
			        return d.data.population.toFixed(0)+" %";
			    });
		
		 var legend = svg.selectAll('.legend')
		    .data(finalData)
		    .enter().append('g')
		    .attr('class', 'legend');

		legend.attr("transform", function(d,i){return "translate(0," +(-150)+")";})
		.attr('id',function(d){ return d.education; });

		legend.append('rect')
		    .attr('x', (width / 2)- 120)
		    .attr('y', function(d, i){ 
		    	console.log(i+"prrrrrrrrrrr"+d.education)
		    	return (i*20)-10;})
		    .attr('width', 10)
		    .attr('height', 10)
		    .style('fill', function(d) { 
		      return color(d.education);
		    });

		legend.append('text')
		    .attr('x', (width / 2)-100)
		    .attr('y', function(d, i){ return (i *20);})
		    .text(function(d){ return d.education; });
}


function raceEtimation(name,alldata, edudata){
	
	//console.log(name+" JSON.stringify(d.values)"+JSON.stringify(data));
	
	var finalData=[];
	var width = 600,
    height = 400,
    radius = Math.min(width, height) / 2;
	
	
	var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
	
	var arcOver = d3.svg.arc()
    .innerRadius(radius + 5)
    .outerRadius(  180 + 5);
	
	var pie=d3.layout.pie()
				.sort(null)
				.value(function(d){ 
					//console.log(" return d.population"+d.population);
					return d.population});
	var svg;
	
	d3.selectAll(".racepiestart").remove();
	if(d3.selectAll(".racepiestart").empty()){
		//d3.selectAll("#educationLevel").remove();
		 svg= d3.select("#usrace").append("svg")
		 .attr("width", width)
		 	.attr("height", height)
		 	.attr("class","racepiestart")
		 	.append("g")
		    .attr("transform", "translate(" + ((width / 2)-100) + "," + height / 2 + ")");
	}
	
	
	
	
	var newSet=[];
	
/*	var map = d3.map(edudata, function(d) { return d.CHSI_State_Name; });
	map.get("foo"); // {"name": "foo"}
	console.log("Al99999999999999____"+JSON.stringify(map.get(name)));*/
	//console.log("Al99999999999999____"+JSON.stringify(name));
	edudata.forEach(function(d){
		
		if(d.CHSI_State_Name==name){
			newSet.push({
				White:d.White,
				Black:d.Black,
				Native_American:d.Native_American,
				Asian:d.Asian,
				Hispanic:d.Hispanic
			})
		}
		
	});
			
	//console.log("Al99999999999999____"+JSON.stringify(newSet));
	
	var avgELH=d3.mean(newSet, function(value){ return value.White});
	newDataSet("White", avgELH);
	var avgEGH=d3.mean(newSet, function(value){ return value.Black});
	newDataSet("Black", avgEGH);
	var avgEAD=d3.mean(newSet, function(value){ return value.Native_American});
	newDataSet("Native American", avgEAD);
	var avgEBD=d3.mean(newSet, function(value){ return value.Asian});
	newDataSet("Asian", avgEBD);
	
	var avgHisp=d3.mean(newSet, function(value){ return value.Hispanic});
	newDataSet("Hispanic", avgHisp);
	
	
	
	var color = d3.scale.category10(); 
	function newDataSet(edName,ppl){			
		finalData.push({race:edName, population:ppl});			
	}
	
//	console.log(" 11111111111JSON.stringify(d.values)"+JSON.stringify(finalData));
		var pieChart= svg.selectAll(".racpiechart")
						.data(pie(finalData))
						.enter()
						.append("g")
						.attr("class", "racpiechart")
						.on("mouseover", function (d) {						
						d3.select(this).select("path").transition()
                        .duration(100)
                        .attr("d", arcOver);       
						})
					   .on("mouseout", function () {
					    	  d3.select(this).select("path").transition()
		                         .duration(100)
		                         .attr("d", arc);

		                  //   textTop.text( "TOTAL" )
		                   //  textBottom.text( "m");
					}) ;
						
		
		pieChart.append("path")
				.attr("class","pathracpiechart")
				.attr("d", arc)
				.attr("fill",function(d){
					//console.log(name+" JSON.stringify(d.values)"+color(d.data.race));
					return color(d.data.race)});
					
		
		pieChart.append("text")
		  .attr("transform", function (d) {			 
			  return "translate(" + arc.centroid(d) + ")";
		  	}) .attr("text-anchor", "middle")
	    .text(function (d) {	    	
	        return d.data.population.toFixed(0)+" %";
	    });

var legend = svg.selectAll('.legend')
  .data(finalData)
  .enter().append('g')
  .attr('class', 'legend');

legend.attr("transform", function(d,i){return "translate(0," +(-150)+")";})
.attr('id',function(d){ return d.race; });

legend.append('rect')
  .attr('x', (width / 2)- 120)
  .attr('y', function(d, i){   
  	return (i*20)-10;})
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) { 
    return color(d.race);
  });

legend.append('text')
  .attr('x', (width / 2)-100)
  .attr('y', function(d, i){ return (i *20);})
  .text(function(d){ return d.race; });

}

function popPoverty(name,alldata, edudata){
	
	 var width = 600 ,
     height = 200 ;
	
	 var margin = {
	            top: 15,
	            right: 50,
	            bottom: 15,
	            left: 90
	        };
	 
	 
		
		var newSet=[], finalData=[];

		//console.log("Al99999999999999____"+JSON.stringify(name));
		edudata.forEach(function(d){
			
			if(d.CHSI_State_Name==name){
				newSet.push({
					Poverty:d.Poverty,
					Population_Size:d.Population_Size
				})
			}
			
		});
				
		//console.log("Al99999999999999____"+JSON.stringify(newSet));
		
		var avgELH=d3.sum(newSet, function(value){ return value.Poverty});
		newDataSet("Poverty", avgELH);
		var avgEGH=d3.sum(newSet, function(value){ return value.Population_Size});
		newDataSet("Population", avgEGH);
				
		
		var color = d3.scale.category10(); 
		function newDataSet(edName,ppl){			
			finalData.push({poppoverty:edName, population:ppl});			
		}
		
		
		 var svg;
		d3.selectAll(".poppovertystart").remove();
		if(d3.selectAll(".poppovertystart").empty()){
	  svg=d3.select("#poppoverty").append("svg")
	 			.attr("width", width+margin.left)
	 			.attr("height", height)
	 			.attr("class","poppovertystart")
	 			.append("g")
	 			.attr("transform", "translate(" + margin.left + "," +margin.top + ")");
		}
		
		 var x = d3.scale.linear()
         .range([0, width-margin.left])
         .domain([0, d3.max(finalData, function (d) {
             return d.population;
         })]);

		 var y = d3.scale.ordinal()
         .rangeRoundBands([100, 0],.3)
         .domain(finalData.map(function (d) {
             return d.poppoverty;
         }));

		 
		  var yAxis = d3.svg.axis()
          .scale(y)
          //no tick marks
          .tickSize(0)
          .orient("left");
		  
		  svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
		  
		  var bars = svg.selectAll(".poppovertybar")
          .data(finalData)
          .enter()
          .append("g")
          .attr("class","poppovertybar");
		  
		  bars.append("rect")		  	
		  	.attr("fill", "blue")
		  	.attr("y", function(d){
		  		
		  		return y(d.poppoverty);
		  	})
		  	.attr("height", y.rangeBand())
		  	.attr("width", function(d){
		  		
		  		return x(d.population);
		  	});
		  
		  bars.append("text")
		  	.attr("class", "label")
		  	.attr("y", function(d){
		  		
		  		return y(d.poppoverty)+ y.rangeBand()/2+4;
		  	})
		  	.attr("x", function(d){
		  		
		  		return x(d.population)+3;
		  	})
		  	.text(function(d){
		  		return d.population.toFixed(0);
		  	});
          
          
}


function ageChart(name,alldata, edudata){
	
	 var width = 600 ,
    height = 200 ;
	
	 var margin = {
	            top: 15,
	            right: 50,
	            bottom: 15,
	            left: 120
	        };
	 
	 
		
		var newSet=[], finalData=[];

		//console.log("Al99999999999999____"+JSON.stringify(name));
		edudata.forEach(function(d){
			
			if(d.CHSI_State_Name==name){
				newSet.push({
					Age_65_84:d.Age_65_84,
					Age_85_and_Over:d.Age_85_and_Over
				})
			}
			
		});
				
		//console.log("Al99999999999999____"+JSON.stringify(newSet));
		
		var avgELH=d3.mean(newSet, function(value){ return value.Age_65_84});
		newDataSet("Age 65 to 84", avgELH);
		var avgEGH=d3.mean(newSet, function(value){ return value.Age_85_and_Over});
		newDataSet("Age 85 & Over", avgEGH);
				
		
		var color = d3.scale.category10(); 
		function newDataSet(edName,ppl){			
			finalData.push({age:edName, population:ppl});			
		}
		
		
		 var svg;
		d3.selectAll(".agechartstart").remove();
		if(d3.selectAll(".agechartstart").empty()){
	  svg=d3.select("#agechart").append("svg")
	 			.attr("width", width+margin.left)
	 			.attr("height", height)
	 			.attr("class","agechartstart")
	 			.append("g")
	 			.attr("transform", "translate(" + margin.left + "," +margin.top + ")");
		}
		
		 var x = d3.scale.linear()
        .range([0, width-margin.left])
        .domain([0, d3.max(finalData, function (d) {
            return d.population;
        })]);

		 var y = d3.scale.ordinal()
        .rangeRoundBands([100, 0],.3)
        .domain(finalData.map(function (d) {
            return d.age;
        }));

		 
		  var yAxis = d3.svg.axis()
         .scale(y)
         //no tick marks
         .tickSize(0)
         .orient("left");
		  
		  svg.append("g")
         .attr("class", "y axis")
         .call(yAxis);
		  
		  var bars = svg.selectAll(".agebar")
         .data(finalData)
         .enter()
         .append("g")
         .attr("class","agebar");
		  
		  bars.append("rect")		  	
		  	.attr("fill", "green")
		  	.attr("y", function(d){
		  		
		  		return y(d.age);
		  	})
		  	.attr("height", y.rangeBand())
		  	.attr("width", function(d){
		  		
		  		return x(d.population);
		  	});
		  
		  bars.append("text")
		  	.attr("class", "label")
		  	.attr("y", function(d){
		  		
		  		return y(d.age)+ y.rangeBand()/2+4;
		  	})
		  	.attr("x", function(d){
		  		
		  		return x(d.population)+3;
		  	})
		  	.text(function(d){
		  		return d.population.toFixed(2)+" %";
		  	});
         
         
}


function classChart(name,alldata, edudata){
	
	 var width = 600 ,
   height = 400 ;
	
	 var margin = {
	            top: 15,
	            right: 50,
	            bottom: 15,
	            left: 50
	        };
	 
	 
		
		var newSet={}, finalData=[];

		//console.log("Al99999999999999____"+JSON.stringify(name));
		alldata.forEach(function(d){
			
			if(d.state_full_form==name){
				
			if(newSet[d.Class] !=null){
				//console.log(newSet[d.Class].length+"lenght--------value  "+ newSet[d.Class]+"Al99999999999999____"+d.Class);
				newSet[d.Class]=newSet[d.Class]+1;
			}else{
				//console.log("2222222___"+d.Class);
				newSet[d.Class]=1;
			}
			
			}
	
		});
		//console.log("Al99999999999999____"+JSON.stringify(newSet));
		for(var key in newSet){
			finalData.push({hospclass:key, value:newSet[key] });
			
		}
		/*finalData=finalData.sort(function(d) {
            return d3.descending(d.hospclass);
	    });*/
		//console.log("Al99999999999999____"+JSON.stringify(finalData));
		
				
		
		 var svg;
		d3.selectAll(".classchartstart").remove();
		if(d3.selectAll(".classchartstart").empty()){
	  svg=d3.select("#classchart").append("svg")
	 			.attr("width", width+margin.left)
	 			.attr("height", height)
	 			.attr("class","classchartstart")
	 			.append("g")
	 			.attr("transform", "translate(" + margin.left + "," +margin.top + ")");
		}
		
		 var x = d3.scale.linear()
       .range([0, width-margin.left])
       .domain([0, d3.max(finalData, function (d) {
           return d.value;
       })]);

		 var y = d3.scale.ordinal()
       .rangeRoundBands([200, 0],.5)
       .domain( finalData.map(function (d) {
           return d.hospclass;
       }));

		 
		  var yAxis = d3.svg.axis()
        .scale(y)
        //no tick marks
        .tickSize(0)
        .orient("left");
		  
		  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
		  
		  var bars = svg.selectAll(".classbar")
        .data(finalData)
        .enter()
        .append("g")
        .attr("class","classbar");
		  
		  bars.append("rect")		  	
		  	.attr("fill", "red")
		  	.attr("y", function(d){
		  		
		  		return y(d.hospclass);
		  	})
		  	.attr("height", y.rangeBand())
		  	.attr("width", function(d){
		  		
		  		return x(d.value);
		  	});
		  
		  bars.append("text")
		  	.attr("class", "label")
		  	.attr("y", function(d){
		  		
		  		return y(d.hospclass)+ y.rangeBand()/2+4;
		  	})
		  	.attr("x", function(d){
		  		
		  		return x(d.value)+3;
		  	})
		  	.text(function(d){
		  		return d.value;
		  	});
        
        
}


function penaltychart(name,alldata, edudata){
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
	//console.log("-------alldata--->"+alldata);
	
	//console.log("\n\n----JSON---alldata--->"+JSON.stringify(alldata));
	
/*	var ageNames = d3.keys(alldata[0]).filter(function(key) { return key !== "State_2013"; });
	console.log(ageNames+"\n\n----JSON---alldata--->"+JSON.stringify(ageNames));
	
	alldata.forEach(function(d) {
	    d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	  });*/
	
	
	var newSet2013={},newSet2014={},newSet2015={}, finalData=[];

	//console.log("Al99999999999999____"+JSON.stringify(name));
	alldata.forEach(function(d){
		
		if(d.state_full_form==name){
			
			if(newSet2013[d.Penalty_2013] !=null){
				//console.log(newSet[d.Class].length+"lenght--------value  "+ newSet[d.Class]+"Al99999999999999____"+d.Class);
				newSet2013[d.Penalty_2013]=newSet2013[d.Penalty_2013]+1;
			}else{
				//console.log("2222222___"+d.Class);
				newSet2013[d.Penalty_2013]=1;
			}

			if(newSet2014[d.Penalty_2014] !=null){
				//console.log(newSet[d.Class].length+"lenght--------value  "+ newSet[d.Class]+"Al99999999999999____"+d.Class);
				newSet2014[d.Penalty_2014]=newSet2014[d.Penalty_2014]+1;
			}else{
				//console.log("2222222___"+d.Class);
				newSet2014[d.Penalty_2014]=1;
			}
			
			if(newSet2015[d.Penalty_2015] !=null){
				//console.log(newSet[d.Class].length+"lenght--------value  "+ newSet[d.Class]+"Al99999999999999____"+d.Class);
				newSet2015[d.Penalty_2015]=newSet2015[d.Penalty_2015]+1;
			}else{
				//console.log("2222222___"+d.Class);
				newSet2015[d.Penalty_2015]=1;
			}
			
		}
		
		

	});
	
	built("Penalty 2013",newSet2013);
	built("Penalty 2014",newSet2014);
	built("Penalty 2015",newSet2015);
	
	function built(panlity, data){
		
		finalData.push({penality_year:panlity, yes_value:data["YES"], no_value:data["NO"] });
	}
		
	var dummyCountAll= [];
	
	  var colNames = d3.keys(finalData[0]).filter(function(key) { return key !== "penality_year"; });
	
	finalData.forEach(function(d){
		d.nameValue=colNames.map(function(name){return {name:name, value:d[name] };});
		//dummyCountAll.push(colNames.map(function(name){return {name:name, value:d[name] };}));
	});
	
	//console.log(dummyCountAll+"2222222___"+JSON.stringify(dummyCountAll));
	
	//console.log("\n\n"+JSON.stringify(finalData)+"\n\n"+finalData.du+"\nfinalData.du___"+JSON.stringify(finalData));
	
	var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width-100], .5);// each x-axis width peanlty2013 --> width-100,  peanlty2014 --> width-100
	
	var x1 = d3.scale.ordinal();

	
	var y = d3.scale.linear()
    .range([height, 0]);
/*	
	var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);*/
	var color = d3.scale.category10();
	
	var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
	
	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));
	
	
	 var svg;
		d3.selectAll(".penaltychartstart").remove();
		if(d3.selectAll(".penaltychartstart").empty()){
	  svg=d3.select("#penaltyidchart").append("svg")
	 			.attr("width", width+margin.left+margin.right)
	 			.attr("height", height+margin.top+margin.bottom)
	 			.attr("class","penaltychartstart")
	 			.append("g")
	 			.attr("transform", "translate(" + margin.left + "," +margin.top + ")");
		}
		
		x0.domain(finalData.map(function(d) { return d.penality_year; }));
		x1.domain(colNames).rangeRoundBands([0,x0.rangeBand()]);
		y.domain([0, d3.max(finalData, function(ob){return d3.max(ob.nameValue, function(d){return d.value;})})]);
		
	//	console.log("\n\n d3.max d3.maxd3.max___"+d3.max(finalData, function(ob){return d3.max(ob.nameValue, function(d){return d.value;})}));
		
		 svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
		 
		  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Penality Value");
		 
		  
		  var state = svg.selectAll(".state")
	      .data(finalData)
	    .enter().append("g")
	      .attr("class", "state")
	      .attr("transform", function(d) { return "translate(" + x0(d.penality_year) + ",0)"; });

	  state.selectAll("rect")
	      .data(function(obj){return obj.nameValue})
	    .enter().append("rect")
	      .attr("width", x1.rangeBand())
	      .attr("x", function(d) { return x1(d.name); })
	      .attr("y", function(d) { return y(d.value); })
	      .attr("height", function(d) { return height - y(d.value); })
	      .style("fill", function(d) { return color(d.name); });
	     
	  
/*	  label.append("text")	 	
	 .attr("width", x1.rangeBand())
	      .attr("x", function(d) { return x1(d.name); })
	      .attr("y", function(d) { return (y(d.value)-5); })
	        .attr("dy", 10)
    .attr("dx", (x1.rangeBand()/1.60) )
	      .attr("height", function(d) { return height - y(d.value); })
	  		.text(function(d) {
	  			
	  			 console.log("ffffffffffff"+ d.value);
	 	  			
	  			
	  			return d.value});*/
	  
	  state.selectAll("text")
	  .data(function(obj){return obj.nameValue})
	    .enter()
	  		.append("text")
		  .attr("class", "barvalues")
		  .attr("text-anchor", "middle")
		  .attr("dx", ".8em")
		//.attr("dy", "15em")
		  .attr("x", function(d) { return x1(d.name); })
		  .attr("y", function(d) { return y(d.value) - 2; })
		  .text(function(d) { return d.value; });
	      /*.on("mouseover", function() { tooltip.style("display", null); })
	      .on("mouseout", function() { tooltip.style("display", "none"); })
	       .on("mousemove", function(d) {
	    	   
	    	
	    	  
		   var xPosition = d3.mouse(this)[0] ;
		    var yPosition = d3.mouse(this)[1] ;
		    console.log(xPosition+"ffffffffffff"+ yPosition);
		    console.log(rangeBand()+"pppppppppppppp"+y(d.value));
		    
		    tooltip.attr("transform", "translate(" + xPosition+ "," + yPosition+ ")");
		  //  tooltip.select("rect").attr("transform", "translate(" + x1(d.name) + "," + y(d.value) + ")");
		    tooltip.select("text").text(d.value);
		    
		 		  });*/
	
	/*  var div = d3.select('#classchart').append('div')   
	    .attr('class', 'tooltip')               
	    .style('opacity', 0);*/
	  
	  var legend = svg.selectAll('.legend')
	  .data(finalData)
	  .enter().append('g')
	  .attr('class', 'legend');

	legend.attr("transform", function(d,i){return "translate(0," +(20)+")";})
	.attr('id',function(d){ return d.race; });

	
	
	
	legend.selectAll("rect")
	  .data(function(obj){return obj.nameValue})
	    .enter().append('rect')
	  .attr('x', width- 150)
	  .attr('y', function(d, i){   
	  	return (i*20)-10;})
	  .attr('width', 10)
	  .attr('height', 10)
	  .style('fill', function(d) { 
	    return color(d.name);
	  });

	
	legend.selectAll("text")
	  .data(function(obj){return obj.nameValue})
	    .enter().append('text')
	  .attr('x', width-120)
	  .attr('y', function(d, i){ return (i *20);})
	  .text(function(d){ return d.name; });
}


function readNoCasechart(name,alldata, edudata){
	
	var margin = {top: 20, right: 120, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
	
	

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width-100], .3);
	
	
		
	var y0 = d3.scale.linear().range([height, 0]),
	y1 = d3.scale.linear().range([height, 0]);
	
	
	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
	
	
	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
	// create right yAxis
	var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");
	
	
	
	var data=[];
	
	function recalculateData(dis){
		var ratioValues2013=[],ratioValues2014=[],ratioValues2015=[], caseValues2013=[],caseValues2014=[],caseValues2015=[];
		alldata.forEach(function(d){
			
			if(d.state_full_form==name){
				
				/*avgRatio2013=(d.Excess_Readmission_Ratio_for_Pneumonia_2013)+avgRatio2013;*/
				if(dis=="Heart Failure"){
					
					ratioValues2013.push(d.Excess_Readmission_Ratio_for_Heart_Failure_2013);
					ratioValues2014.push(d.Excess_Readmission_Ratio_for_Heart_Failure_2014);
					ratioValues2015.push(d.Excess_Readm_Ratio_HF_2015);
					
					caseValues2013.push(d.Number_of_Heart_Failure_Cases_2013);
					caseValues2014.push(d.Number_of_Heart_Failure_Cases_2014);
					caseValues2015.push(d.No_of_HFCases_2015);
					
				}
				else if(dis=="Acute Myocardial"){
					
					ratioValues2013.push(d.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2013);
					ratioValues2014.push(d.Acute_Myocardial_Infarction_Excess_Readmission_Ratio_2014);
					ratioValues2015.push(d.AMI_Excess_Readm_Ratio_2015_modified);
					
					caseValues2013.push(d.Number_of_Acute_Myocardial_Infarction_Cases_2013);
					caseValues2014.push(d.Number_of_Acute_Myocardial_Infarction_Cases_2014);
					caseValues2015.push(d.No_of_AMI_2015);
					
				}else{
								
				ratioValues2013.push(d.Excess_Readmission_Ratio_for_Pneumonia_2013);
				ratioValues2014.push(d.Excess_Readmission_Ratio_for_Pneumonia_2014);
				ratioValues2015.push(d.Excess_Readm_Ratio_Pn_2015);
				
				caseValues2013.push(d.Number_of_Pneumonia_Cases_2013);
				caseValues2014.push(d.Number_of_Pneumonia_Cases_2014);
				caseValues2015.push(d.No_of_Pn_Cases_2015);
				}
			}		

		});
		var avgRat2013=d3.mean(ratioValues2013), 
		avgRat2014=d3.mean(ratioValues2014),
		avgRat2015=d3.mean(ratioValues2015),
		avgCas2013=d3.mean(caseValues2013),
		avgCas2014=d3.mean(caseValues2014),
		avgCas2015=d3.mean(caseValues2015);
		
		pushNewData("2013",avgRat2013, avgCas2013);
		pushNewData("2014",avgRat2014, avgCas2014);
		pushNewData("2015",avgRat2015, avgCas2015);	
	}
	
	recalculateData(null);
	
	function pushNewData(year, ratio, cases){
		
	data.push({year:year, ratio:ratio, cases:cases});
	}
	
	
	
	
	
	var svg;
	d3.selectAll(".readcasechartstart").remove();
	if(d3.selectAll(".readcasechartstart").empty()){
  svg=d3.select("#readcaseidchart").append("svg")
 			.attr("width", width+margin.left+margin.right)
 			.attr("height", height+margin.top+margin.bottom)
 			.attr("class","readcasechartstart")
 			.append("g")
 			.attr("transform", "translate(" + margin.left + "," +margin.top + ")");
	}
	
	
	
	 x.domain(data.map(function(d) { return d.year; }));
	  y0.domain([0, d3.max(data, function(d) { return d.ratio; })]);
	  y1.domain([0, d3.max(data, function(d) { return d.cases; })]);
	
	  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

	  
	  svg.append("g")
	  .attr("class", "y axis axisLeft")
	  .attr("transform", "translate(0,0)")
	  .call(yAxisLeft)
	  .append("text")
	  .attr("dy","1.5em")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor","end")
	  .text("Readmission Ratio");
	  
	  svg.append("g")
	  .append("text")
	  .attr("class","distext")
	    .attr("x", width/2)
      .attr("y", -3)
      //.attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Barchart: Pneumonia");
	  
	  svg.append("g")
	  .attr("class", "y axis axisRight")
	  .attr("transform", "translate("+(width-100)+",0)")
	  .call(yAxisRight)
	  .append("text")
	  .attr("dy","-1em")
	  .attr("dx", "-2em")
	  .style("text-anchor","end")
	  .attr("transform", "rotate(-90)")
	  .text("Number of cases");
	  
	  var color = d3.scale.category10();
	  
	  var bars= svg.selectAll(".barData")
	  				.data(data)
	  				.enter()
	  				.append("g")
	  				.attr("class","barData");
	  				
	bars.append("rect")
		 .attr("class", "bar1")
		 .attr("x", function(d){return x(d.year)})
		 .attr("y", function(d){return y0(d.ratio)})
		 .attr("width", x.rangeBand()/2)
		 .attr("height",function(d){return height - y0(d.ratio);});
	
	
	
	  bars.append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.year) + x.rangeBand()/2; })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function(d) { return y1(d.cases); })
	  .attr("height", function(d,i,j) { return height - y1(d.cases); })	;
	  /*.style("fill", function(d) { return color(i); });*/
	  
	
	  var legend=svg.selectAll(".legend")
	  				.data(["Pneumonia","Heart Failure","Acute Myocardial"])
	  				.enter()
	  				.append("g")
	  				.attr("class", "legend")
	  		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  
/*	  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);*/
	  
	  legend.append("text")
      .attr("x", width+60)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      .on("click", function(d){
    	  d3.selectAll(".barData").remove();    	  
    	  data=[];
    	  recalculateData(d);
    	  
    	//  console.log(name+"\nJJJJJJJJJJJJJ"+JSON.stringify(data));
    	  x.domain(data.map(function(d) { return d.year; }));
    	  y0.domain([0, d3.max(data, function(d) { return d.ratio; })]);
    	  y1.domain([0, d3.max(data, function(d) { return d.cases; })]);   	      	  

    	  d3.selectAll(".y.axisLeft").remove();  
    	  d3.selectAll(".y.axisRight").remove();  
    	  d3.selectAll(".distext").remove(); 
    	  svg.append("g")
    	  .attr("class", "y axis axisLeft")
    	  .attr("transform", "translate(0,0)")
    	  .call(yAxisLeft)
    	  .append("text")
    	  .attr("dy","1.5em")
    	  .attr("transform", "rotate(-90)")
    	  .style("text-anchor","end")
    	  .text("Readmission Ratio");
    	  
    	  svg.append("g")
    	  .append("text")
    	  .attr("class","distext")
    	    .attr("x", width/2)
          .attr("y",-3)
          //.attr("dy", ".35em")
          .style("text-anchor", "end")
          .text("Barchart: "+d);
    	  
    	  
    	  svg.append("g")
    	  .attr("class", "y axis axisRight")
    	  .attr("transform", "translate("+(width-100)+",0)")
    	  .call(yAxisRight)
    	  .append("text")
    	  .attr("dy","-1em")
    	  .attr("dx", "-2em")
    	  .style("text-anchor","end")
    	  .attr("transform", "rotate(-90)")
    	  .text("Number of cases");
    	  
    	  bars= svg.selectAll(".barData")
			.data(data)
			.enter()
			.append("g")
			.attr("class","barData");
			
bars.append("rect")
.attr("class", "bar1")
.attr("x", function(d){return x(d.year)})
.attr("y", function(d){return y0(d.ratio)})
.attr("width", x.rangeBand()/2)
.attr("height",function(d){return height - y0(d.ratio);});



bars.append("rect")
.attr("class", "bar2")
.attr("x", function(d) { return x(d.year) + x.rangeBand()/2; })
.attr("width", x.rangeBand() / 2)
.attr("y", function(d) { return y1(d.cases); })
.attr("height", function(d,i,j) { return height - y1(d.cases); })	;


bars.append("text")
.attr("class", "bar1values")
.attr("text-anchor", "middle")
.attr("dx", "3.5em")
//.attr("dy", "15em")
.attr("x", function(d) { return x(d.year); })
.attr("y", function(d) { return (y1(d.cases) -3); })
.text(function(d) { return d.cases.toFixed(0); });

bars.append("text")
.attr("class", "bar2values")
.attr("text-anchor", "middle")
.attr("dx", "1em")
//.attr("dy", "15em")
.attr("x", function(d) { return x(d.year); })
.attr("y", function(d) { return (y0(d.ratio) -3); })
.text(function(d) { return d.ratio.toFixed(3); });
    	  
      });

	  
	  bars.append("text")
		  .attr("class", "bar1values")
		  .attr("text-anchor", "middle")
		  .attr("dx", "3.5em")
		//.attr("dy", "15em")
		  .attr("x", function(d) { return x(d.year); })
		  .attr("y", function(d) { return (y1(d.cases) -3); })
		  .text(function(d) { return d.cases.toFixed(0); });
	  
	  bars.append("text")
	  .attr("class", "bar2values")
	  .attr("text-anchor", "middle")
	  .attr("dx", "1em")
	//.attr("dy", "15em")
	  .attr("x", function(d) { return x(d.year); })
	  .attr("y", function(d) { return (y0(d.ratio) -3); })
	  .text(function(d) { return d.ratio.toFixed(3); });
}
