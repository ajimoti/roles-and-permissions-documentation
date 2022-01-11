import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Takes less than 5 minutes to install, and get start assigning roles and permissions.
        No need to write any code.
        {/* The simple roles and permissions package for laravel applications.
        Supports with <code>many-to-many</code> relationships (pivot tables). */}
      </>
    ),
  },
  {
    title: 'Hierarchy Roles',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Supports roles in hierarchy.
        Lets your higher level roles inherit the permissions of their lower level roles.
        Reduce the number of duplicate permissions spread across multiple roles.
      </>
    ),
  },
  {
    title: 'Many to Many Relationships',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Supports <code>many-to-many</code> relationships.
        Learn how to assign roles and permissions on a <code>pivot table</code>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
