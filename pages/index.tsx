import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeometryCollection, Topology } from 'topojson-specification';
import us from '../assets/counties-10m.json';

const Map = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const width = 1000;
  const height = 600;
  const defaultScale = d3.geoAlbersUsa().scale();
  const projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale((defaultScale * height) / 600);
  const path = d3.geoPath().projection(projection);

  useEffect(() => {
    if (svgRef.current && tooltipRef.current) {
      const svg = d3.select(svgRef.current);
      const tooltip = tooltipRef.current;
      svg.selectAll('*').remove();

      svg.attr('width', width).attr('height', height);

      svg
        .append('g')
        .style('fill', '#fff')
        .style('cursor', 'pointer')
        .selectAll('.state')
        .data(topojson.feature(us as unknown as Topology, us.objects.states as GeometryCollection<{}>).features)
        .join('path')
        .on('mouseover', (e, _) => {
          e.target.setAttribute('fill', 'pink');
          tooltip.style.display = 'block';
        })
        .on('mouseout', (e, _) => {
          e.target.setAttribute('fill', '#fff');
          tooltip.style.display = 'none';
        })
        .attr('d', path);

      svg
        .append('path')
        .datum(topojson.mesh(us as unknown as Topology, us.objects.nation as GeometryCollection<{}>))
        .attr('d', path)
        .attr('class', 'nation')
        .style('stroke', '#000')
        .style('stroke-width', '1')
        .style('stroke-linejoin', 'round')
        .style('stroke-linecap', 'round')
        .style('fill', 'none');

      svg
        .append('path')
        .datum(topojson.mesh(us as unknown as Topology, us.objects.states as GeometryCollection<{}>))
        .attr('d', path)
        .on('click', () => {
          console.log('Hello World!');
        })
        .attr('class', 'state')
        .style('stroke', '#000')
        .style('stroke-width', '0.5')
        .style('stroke-linejoin', 'round')
        .style('stroke-linecap', 'round')
        .style('fill', 'none');
    }
  }, [svgRef.current, tooltipRef.current]);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltip = tooltipRef.current;
      window.addEventListener('mousemove', (e: MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;

        tooltip.style.top = `${y + 20}px`;
        tooltip.style.left = `${x + 20}px`;
      });
    }
  }, [tooltipRef.current]);

  return (
    <div>
      <svg id='map' className={styles.map} ref={svgRef}></svg>{' '}
      <div className={styles.tooltip} ref={tooltipRef}>
        Hello world!
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>World Map</title>
        <meta name='description' content='Interactive world map' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>World Map</h1>
        <Map />
      </main>

      <footer className={styles.footer}>
        <a href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app' target='_blank' rel='noopener noreferrer'>
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
